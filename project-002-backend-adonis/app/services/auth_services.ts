/* eslint-disable prettier/prettier */
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import {
  AuthUserDetails,
  ForgotPasswordData,
  LoginData,
  PasswordResetToken,
  RegisterData,
  ResetPasswordData,
} from '../types/auth_interface.js'
import { ApiResponse } from '../types/response_interface.js'
import ResponseService from './response_service.js'
import UsersService from './users_service.js'
import config from '@adonisjs/core/services/config'
import Token from '#models/token'
import { uuidv4 } from '../helpers/index.js'
import { DateTime } from 'luxon'
import { inject } from '@adonisjs/core'
import { log } from 'console'

@inject()
export default class AuthService {
  constructor(
    private responseService: ResponseService,
    private userService: UsersService
  ) { }

  async login(_data: LoginData, isAdminRoute: boolean): Promise<ApiResponse> {
    const user = await User.findBy('email', _data.email)

    try {
      if (!user) {
        return this.responseService.buildFailure('Invalid email address')
      }

      if (!user.password) {
        return this.responseService.buildFailure('Invalid credentials')
      }

      // Check if the user is Active. For that you have to create isActive column in your users table.

      await user.load('roles')

      const roleCheckResult = await this.userService.checkUserRoles(user, isAdminRoute)

      if (roleCheckResult.status === 'failure') {
        return roleCheckResult
      }

      if (!(await hash.verify(user.password, _data.password))) {
        return this.responseService.buildFailure('Invalid credentials')
      }

      // Create Token with user details
      const token = await User.accessTokens.create(user, ['*'], {
        expiresIn: config.get('TokenExpiryTime'),
      })
      const tokenJSONData = token.toJSON()

      const userRoles = user.roles.map((role: { slug: string }) => role.slug)

      console.log(user.roles)

      // Send the User details along with tokens and the roles data

      const userDetails: AuthUserDetails = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: userRoles[0],
        token: tokenJSONData.token,
      }

      return this.responseService.buildSuccess('Logged In Successfully', userDetails)
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      return this.responseService.buildFailure(
        error.name === 'InvalidCredentialsException'
          ? 'Invalid Credentials'
          : 'Something went wrong while logging in, please try again later.',
        { respCode: 500 }
      )
    }
  }

  async logout(auth: any): Promise<ApiResponse> {
    try {
      const user = await auth.getUserOrFail()
      console.log("Logged In User : ", user)
      const token = auth.user?.currentAccessToken.identifier
      if (!auth.user?.currentAccessToken.identifier) {
        return this.responseService.buildFailure('Token not found')
      }
      await User.accessTokens.delete(user, token)
      return this.responseService.buildSuccess('Logout successfully.', {
        revoked: true,
      })
    } catch (error) {
      console.error(error)
      return this.responseService.buildFailure(
        'Something went wrong while logging out, unable to logged out from system.',
        error.stack
      )
    }
  }

  /**
   * Handles the forgot password process.
   *
   * @param {ForgotPasswordData} _data - The data containing the email address for password reset.
   * @param {boolean} isAdminRoute - Flag to check if the current route is for admin.
   * @returns A response indicating success or failure of the operation.
   */
  async forgotPassword(_data: ForgotPasswordData, isAdminRoute: boolean): Promise<ApiResponse> {
    try {

      // Get USer by email, -- if USer - send reset password link or if not - return failure
      // Load user roles

      // roleCheReuslt --> CheckUSerRole(userid) === Verifying the user Role
      // isDeleteToken==> delete all the old tokens
      // create token uuid4
      // Create new Expiry Date
      // passwordResetToken (tokenableId, name, type, hash, abilities, expiresAt)
      // save passwordResetToken
      // Create A UserData to be sent to the user via email
      /* const userData = user.serialize()
    // Send Email
    const projectUIUrl = env.get('APP_UI_URL', '')
    userData['resetPasswordUrl'] = `${projectUIUrl}/reset-password/${token}`
    userData['closingText'] = env.get('APP_NAME', '')
    userData['name'] = user.firstName ? user.firstName : 'Admin'
  
    const emailResponse = await this.emailService.sendMail('reset_password', userData)
  
    if (emailResponse.status === 'failure') {
      this.responseService.buildLogger('error', emailResponse)
      return this.responseService.buildFailure(emailResponse.message)
    }
  */
      // Send Email

      const user = await User.findBy('email', _data.email)

      if (!user) {
        return this.responseService.buildFailure('Invalid email address')
      }

      await user.load('roles')

      const roleCheckResult = await this.userService.checkUserRoles(user, isAdminRoute)

      if (roleCheckResult.status === 'failure') {
        return roleCheckResult
      }

      const isDeleteTooken = await this.deleteOldResetTokens(user.id)

      if (!isDeleteTooken) {
        throw new Error('Something went wrong while requesting a password reset link, please try again later.')
      }

      const token = uuidv4()

      const expiryDate = DateTime.now().plus({ hours: 24 });

      const passwordResetToken: PasswordResetToken = new Token();
      passwordResetToken.tokenableId = user.id;
      passwordResetToken.name = 'password_reset';
      passwordResetToken.type = 'password_reset';
      passwordResetToken.hash = token;
      passwordResetToken.abilities = '[]';
      passwordResetToken.expiresAt = expiryDate;

      await passwordResetToken.save()

      const userData = user.serialize()

      /* 
      const emailResponse = await this.emailService.sendMail('reset_password', userData)
  
        if (emailResponse.status === 'failure') {
          this.responseService.buildLogger('error', emailResponse)
          return this.responseService.buildFailure(emailResponse.message)
    } */

    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure(
        'Something went wrong while requesting a password reset link, please try again later.'
      )
    }
  }

  /**
   * Verifies if the provided token is valid for resetting the password.
   *
   * @param {string} token - The token provided for password reset.
   * @param {boolean} isAdminRoute - Flag to check if the current route is for admin.
   * @returns A response indicating the validity of the token.
   */
  async verifyToken(token: string, isAdminRoute: boolean): Promise<ApiResponse> {
    try {

      const tokenResponse = await Token.findBy('token', token)

      if (!tokenResponse) {
        return this.responseService.buildFailure('Invalid token')
      }

      const tokenRecord = tokenResponse.toJSON()

      // find user by tokenable_id

      const user = await User.find(tokenRecord.tokenable_id)

      if (!user) {
        return this.responseService.buildFailure('Invalid Reset Password Link')
      }

      await user.load('roles')

      const roleCheckResult = await this.userService.checkUserRoles(user, isAdminRoute)
      if (roleCheckResult.status === 'failure') return roleCheckResult

      // Check if the token is expires if yes then delete it.

      if (tokenRecord.expires_at < new Date()) {
        await Token.query().where('hash', token).where('type', 'password_reset')
        return this.responseService.buildFailure('Token Expired')
      }

      return this.responseService.buildSuccess('Reset password link is valid to use')
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure(
        'Something went wrong while verifying token, please try again later.'
      )
    }
  }

  /**
   * Resets the user's password if the provided token is valid.
   *
   * @param {ResetPasswordData} _data - Data containing the new password and reset token.
   * @param {boolean} isAdminRoute - Flag to check if the current route is for admin.
   * @returns A response indicating the deletion of token.
   */
  async resetPassword(_data: ResetPasswordData, isAdminRoute: boolean): Promise<ApiResponse> {
    try {


      // get token by token sent by the data from request bidy
      // if token then go ahead or error
      // tokenRecord -- if expired --> delete token
      // if not expired --> Success
      // find the user fromthe tokenRecords.tockenableId
      // if the user then fibr the old_password and replace it by the new password

      const token = await Token.findBy('token', _data.token)

      if (!token) {
        return this.responseService.buildFailure('Invalid Reset Password Link')
      }

      const tokenRecord = token.toJSON();

      if (tokenRecord.expires_at < new Date()) {
        await Token.query().where('tokenable_id', token.tokenableId)
          .where('type', 'password_reset')
          .delete()
        return this.responseService.buildFailure('Token Expired')

      }

      const user = await User.find(tokenRecord.tokenable_id)

      if (!user) {
        return this.responseService.buildFailure('Invalid Reset Password Link')
      }

      await user.load('roles')

      const checkRoleResults = await this.userService.checkUserRoles(user, isAdminRoute)
      if (checkRoleResults.status === 'failure') return checkRoleResults

      user.password = _data.password

      await user.save()

      await Token.query()
        .delete()

      return this.responseService.buildSuccess('Password reset successfully')
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure(
        'Something went wrong while resetting your password, please try again later.'
      )
    }
  }

  /**
   * Deletes any existing password reset tokens for the given user.
   *
   * @param {number} userId - The ID of the user for whom tokens need to be deleted.
   * @returns A response indicating the success or failure of the password reset operation.
   */
  private async deleteOldResetTokens(userId: number): Promise<boolean> {
    try {
      await Token.query().where('tokenable_id', userId).where('type', 'password_reset').delete()
      return true
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return false
    }
  }
}

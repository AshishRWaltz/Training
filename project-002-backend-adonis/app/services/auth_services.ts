/* eslint-disable prettier/prettier */
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import {
  AuthUserDetails,
  ForgotPasswordData,
  LoginData,
  RegisterData,
} from '../types/auth_interface.js'
import { ApiResponse } from '../types/response_interface.js'
import ResponseService from './response_service.js'
import UsersService from './users_service.js'
import config from '@adonisjs/core/services/config'
import Token from '#models/token'
import { uuidv4 } from '../helpers/index.js'
import { DateTime } from 'luxon'

export default class AuthService {
  constructor(
    private responseService: ResponseService,
    private userService: UsersService
  ) {}

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
      const token = auth.user?.currentAccessToken.identifier
      if (!auth.user?.currentAccessToken.identifier) {
        return this.responseService.buildFailure('Token not found')
      }
      await User.accessTokens.delete(user, token)
      return this.responseService.buildSuccess('Logout successfully.', {
        revoked: true,
      })
    } catch (error) {
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

import AuthService from '#services/auth_services'
import ResponseService from '#services/response_service'
import { forgotPasswordValidator, loginValidator, registerValidator, resetPasswordValidator } from '#validators/auth'
import { ForgotPasswordData, LoginData, RegisterData, ResetPasswordData } from '../types/auth_interface.js'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  /**
   * Dependency injection constructor
   *
   * @param {ResponseService} responseService - instance of ResponseService
   * @param {AuthService} authService - instance of AuthService
   */
  constructor(
    /* Declare AuthService and ResponseService */
    private responseService: ResponseService,
    private authService: AuthService
  ) { }

  // async register({ request, response }) {
  //     // get all the resgister user data
  //     // validate it
  //     // trycatch
  //     // check if the user email already exists
  //     // register the user with authservice
  //     // if failed return error message
  //     // return sendresposne

  //     const data = request.all() as RegisterData
  //     await request.validateUsing(registerValidator)

  //     try {
  //         const activityResponse = await this.authService.register(data)
  //     } catch (error) {
  //         return this.responseService.buildFailure(error.message)
  //     }

  //     return { message: 'Register' }
  // }

  async login({ request, response }: HttpContext) {
    const data = request.all() as LoginData
    await request.validateUsing(loginValidator)

    // Check if the route is for an admin or regular user
    const isAdminRoute = request.url().includes('admin')

    try {
      const activityResponse = await this.authService.login(data, isAdminRoute)

      if (activityResponse.status === 'failure') {
        if (activityResponse.data && activityResponse.data.respCode) {
          return this.responseService.sendResponse(response, activityResponse, {
            overrideHttpCode: activityResponse.data.respCode,
          })
        }
      }
      return this.responseService.sendResponse(response, activityResponse)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure(
          'Something went wrong while logging in, please try again later.'
        )
      )
    }
  }

  async logout({ response, auth }: HttpContext) {
    try {
      const activityResponse = await this.authService.logout(auth)
      return this.responseService.sendResponse(response, activityResponse)
    } catch (error) {
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure(
          'Something went wrong while logging out, please try again later.',
          error.stack
        )
      )
    }
  }

  async forgotPassword({ request, response }: HttpContext) {
    await request.validateUsing(forgotPasswordValidator)

    // Check if the route is for an admin or regular user
    const isAdminRoute = request.url().includes('admin')

    try {
      const activityResponse = await this.authService.forgotPassword(
        request.all() as ForgotPasswordData,
        isAdminRoute
      )

      return this.responseService.sendResponse(response, activityResponse)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure(
          'Something went wrong while sending account reset mail, please try again later.'
        )
      )
    }
  }

  async verifyToken({ request, params, response }: HttpContext) {
    try {
      if (!params.token) {
        this.responseService.buildLogger('warn', 'Invalid reset password link')
        return this.responseService.sendResponse(
          response,
          this.responseService.buildFailure('Invalid reset password link')
        )
      }
      const isAdminRoute = request.url().includes('admin')

      const activityResponse = await this.authService.verifyToken(params.token, isAdminRoute)
      return this.responseService.sendResponse(response, activityResponse)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure(
          'Unable to verify token, something went wrong, please try again later.'
        )
      )
    }
  }

  async resetPassword({ request, response }: HttpContext) {
    await request.validateUsing(resetPasswordValidator)

    // Check if the route is for an admin or regular user
    const isAdminRoute = request.url().includes('admin')
    try {
      const activityResponse = await this.authService.resetPassword(
        request.all() as ResetPasswordData,
        isAdminRoute
      )

      return this.responseService.sendResponse(response, activityResponse)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure(
          'Something went wrong while resetting your password, please try again later.'
        )
      )
    }
  }
}

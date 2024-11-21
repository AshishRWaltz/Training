import ResponseService from '#services/response_service'
import UsersService from '#services/users_service'
import { changePasswordValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'
import { ChangePasswordRequest, ProfileUpdateData } from '../types/AccountSettingsInterface.js'
import User from '#models/user'
import { profileValidator } from '#validators/account_seetings'
import { inject } from '@adonisjs/core'

@inject()
export default class AccountSettingController {
  constructor(
    private responseService: ResponseService,
    private userService: UsersService
  ) { }

  changePassword = async ({ request, response, auth }: HttpContext) => {
    await request.validateUsing(changePasswordValidator)

    try {
      const data = request.all() as ChangePasswordRequest
      const activeUser = auth.user as User

      // Update the user's Password

      const activityResponse = await this.userService.updatePassword(activeUser,
        data)

      if (activityResponse?.status === 'success') {
        activityResponse.message = 'Password has been changed successfully.'
        delete activityResponse.data
      }

      return this.responseService.sendResponse(response, activityResponse)
    } catch (error) {
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure(
          'Something went wrong while changing password, please try again later.'
        )
      )
    }
  }

  async updateProfile({ request, response, auth }: HttpContext) {
    // Extract and validate incoming request data
    const data = request.all() as ProfileUpdateData
    await request.validateUsing(profileValidator)

    try {
      // Call userService to update the profile, passing along the admin route flag
      const activityResponse = await this.userService.updateProfile(data, auth)

      // Handle failure cases with custom HTTP response codes if available
      if (activityResponse.status === 'failure') {
        if (activityResponse.data && activityResponse.data.respCode) {
          return this.responseService.sendResponse(response, activityResponse, {
            overrideHttpCode: activityResponse.data.respCode,
          })
        }
      }

      // Send the response (success or failure)
      return this.responseService.sendResponse(response, activityResponse)
    } catch (error) {
      // Log any error encountered during the profile update process
      this.responseService.buildLogger('error', error)

      // Return a failure response in case of an exception
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure(
          'Something went wrong while updating the profile, please try again later.'
        )
      )
    }
  }

  async getProfile({ response, auth }: HttpContext) {
    try {
      // Get the authenticated user (assumes the user is authenticated)
      const authenticatedUser = auth.user as User

      // Fetch the user's profile details using the userService, passing in the user
      const profileDetails = await this.userService.getProfile(
        authenticatedUser
      )

      // Return the profile details using the responseService
      return this.responseService.sendResponse(response, profileDetails)
    } catch (error) {
      // Log the error using the responseService
      this.responseService.buildLogger('error', error)

      // Return a failure response with a generic error message
      return this.responseService.sendResponse(
        response,
        this.responseService.buildFailure(
          'Something went wrong while retrieving profile details. Please try again later.'
        )
      )
    }
  }
}

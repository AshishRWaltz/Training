/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/naming-convention */
import User from '#models/user'
import { DateTime } from 'luxon'
import {
  AddUserData,
  ListCriteria,
  UserProfileupdated_ata,
  UsersDataResponse,
} from '../types/user_interface.js'
import ResponseService from './response_service.js'
import { inject } from '@adonisjs/core'
import { ApiResponse } from '../types/response_interface.js'
import { ROLES } from '#config/app'
import { hasRole } from '../helpers/index.js'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import Role from '#models/role'
import db from '@adonisjs/lucid/services/db'
import { ChangePasswordRequest, ProfileUpdateData } from '../types/AccountSettingsInterface.js'
import hash from '@adonisjs/core/services/hash'

@inject()
export default class UsersService {
  constructor(private responseService: ResponseService) { }

  public async masterlist(criteria: ListCriteria): Promise<ApiResponse> {
    try {
      const tempRecords = User.query()
        .select([
          'id',
          'first_name',
          'last_name',
          'email',
          'is_active',
          'password',
          'created_at',
          'updated_at',
        ])
        //
        .preload('roles', (query: any) => {
          query.select('name', 'slug')
        })
        //
        // .whereHas('roles', (templateQuery: any) => {
        //     templateQuery.whereNot('name', ROLES.ADMIN)
        // })
        //
        .whereHas('roles', (templateQuery: any) => {
          templateQuery.whereNot('slug', 'admin') // Check for the role slug instead of name
        })
        // Apply Common Search term uf provided in the Criteria
        .if(criteria.search, (builder) => {
          builder.where((query) => {
            query.where('first_name', 'LIKE', `%${criteria.search}`)
            query.orWhere('last_name', 'LIKE', `%${criteria.search}`)
            query.orWhere('email', 'LIKE', `%${criteria.search}`)
          })
        })
        // Apply Sorting If Specified
        .if(criteria.orderby === 'created_at', (builder) => {
          builder.orderBy(criteria.orderby, criteria.order)
        })
      return this.responseService.buildSuccess('Users Data Fetched Successfully', tempRecords)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Error Fetching Users Data')
    }
  }

  /**
   * The method is used for fetching users from the database
   * based on the query string parameters.
   *
   *  @params {ListCriteria} criteria - The criteria object containing the query string parameters.
   *
   *  @returns {ApiResponse} - The response object containing the status and data.
   */

  public list = async (criteria: ListCriteria): Promise<ApiResponse> => {
    try {
      // Default Pagination Values

      let limit = Math.abs(criteria.limit || 10)
      let page = Math.abs(criteria.page || 1)

      // Fetch master list based on criteria:

      let masterListResp = await this.masterlist(criteria)

      if (masterListResp.status === 'failure') {
        return masterListResp
      }

      // Order Records by descending ID and paginate:
      masterListResp.data = masterListResp.data.orderBy('id', 'desc')
      let records = await masterListResp.data.paginate(page, limit)

      records = records.serialize()

      const _data = {
        records: records.data,
        pagination: {
          page: records.meta.currentPage,
          limit: records.meta.limit,
          totalPages: records.meta.lastPage,
          totalCount: records.meta.total,
        },
      }

      return this.responseService.buildSuccess(
        'Users Data is Fetched successfully for the given Criteria',
        _data
      )
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Error Fetching Users Data')
    }
  }

  async addUser(data: AddUserData,
    // auth: Authenticator<Authenticators>
  ): Promise<ApiResponse> {
    const trx = await db.transaction()
    // Retrieve the currently authenticated user and load their associated roles
    // const activeUser = auth.user as User
    let userRole: any = await Role.findBy('slug', ROLES.USER)

    // Check if the authenticated user's account is active; if not, return a failure response
    // if (!activeUser?.isActive) {
    //   return this.responseService.buildFailure('Account is temporarily suspended')
    // }
    // Verify if the provided email is already associated with an existing user
    const emailExists = await User.query().where('email', data.email).first()

    // If a user with the same email exists, return a failure response
    if (emailExists) {
      return this.responseService.buildFailure('Email address is already taken by another user')
    }

    try {
      // Create a new user instance and assign the provided data
      const user = new User()
      user.useTransaction(trx)
      user.first_name = data.first_name
      user.last_name = data.last_name
      user.email = data.email
      user.password = data.password

      // Save the new user to the database
      await user.save()

      await user.related('roles').attach([userRole.id])

      // Return success response after successfully saving the new user
      trx.commit()
      return this.responseService.buildSuccess('User added successfully')
    } catch (error) {
      // Log the error for debugging purposes
      this.responseService.buildLogger('error', error)

      // Return a failure response if something goes wrong during the user creation process
      return this.responseService.buildFailure(
        'Something went wrong while adding the user data, please try again later'
      )
    }
  }

  public details = async (criteria: ListCriteria) => {
    try {
      const user = await User.query()
        .select(['id', 'first_name', 'last_name', 'email', 'password', 'created_at', 'updated_at'])
        // .where('id', criteria.id)
        .first()

      if (!user) {
        return this.responseService.buildFailure('User not found', [])
      }

      return this.responseService.buildSuccess('User Data Fetched Successfully', user)
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Error Fetching User Data, Please try again later ')
    }
  }

  // Create a New User By Admin:

  /**
   * The method is used for adding a new user to the database.
   *
   * @param {AddUserData} data - The data object containing the user details.
   * @returns {Promise<ApiResponse>} - The response object containing the status and data.
   */
  create = async (data: AddUserData): Promise<ApiResponse> => {
    // Retrieve the currently authenticated user and load their associated roles and permissions

    // Check if the authenticated user's account is active; if not return an failure response;

    // Check if the provided email is already in use;

    const emailExists = await User.query().where('email', data.email).first()

    if (emailExists) {
      return this.responseService.buildFailure('Email already in use')
    }

    try {
      // Create a new instance of the User model
      const user = new User()
      user.first_name = data.first_name
      user.last_name = data.last_name
      user.email = data.email
      user.password = data.password

      // Save the user to the database
      await user.save()

      return this.responseService.buildSuccess('User added successfully')
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Error Adding User')
    }
  }

  /**
   * The method is used for updating a user in the database.
   *
   * @param {UserProfileupdated_ata} data - The data object containing the user details.
   * @returns {Promise<ApiResponse>} - The response object containing the status and data.
   */
  public update = async (data: UserProfileupdated_ata): Promise<ApiResponse> => {
    // Check if the User is Authenticated and load their associated roles and permissions

    // Check if the authenticated user's account is active or not else throw error adn failed request

    // Check if the provided email is already in use;

    const mobileExists = await User.query().where('email', data.email).first()

    if (mobileExists) {
      return this.responseService.buildFailure('Email already in use')
    }
    try {
      const user = await User.query().where('id', data?.id).first()

      // Check if the user exists
      if (!user) {
        return this.responseService.buildFailure('User not found', [])
      }
      // Update the user
      user.first_name = data.first_name ? data.first_name : user.first_name
      user.last_name = data.last_name ? data.last_name : user.last_name
      user.email = data.email ? data.last_name : user.email
      user.password = data.password ? data.last_name : user.password

      // Save the user
      await user.save()

      return this.responseService.buildSuccess('User updated successfully')
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Error Updating User')
    }
  }

  public delete = async (id: number): Promise<ApiResponse<User>> => {
    // Check if the User is Authenticated and load their associated roles and permissions

    // Check if the authenticated user's account is active or not else throw error adn failed request

    try {
      const user = await User.query().where('id', id).first()
      if (!user) {
        return this.responseService.buildFailure('User not found')
      }
      await user.delete()
      return this.responseService.buildSuccess('User deleted successfully')
    } catch (error) {
      this.responseService.buildLogger('error', error)
      return this.responseService.buildFailure('Error Deleting User')
    }
  }

  public checkUserRoles = async (user: User, isAdminRoute: boolean): Promise<ApiResponse> => {
    const isUserAdmin = hasRole(user, ROLES.ADMIN)

    // If the route is for admin but the user is not an admin
    if (isAdminRoute && !isUserAdmin) {
      console.log("Not admin  but admin route")
      return this.responseService.buildFailure('Only Admin can perform this action from here.')
    }

    // If the route is not for admin but the user is an admin
    if (!isAdminRoute && isUserAdmin) {
      console.log("Not admin route but admin")
      return this.responseService.buildFailure('Only User can perform this action from here.')
    }

    // If the user has the correct role for the route
    return this.responseService.buildSuccess('Access granted.')
  }

  async updatePassword(
    activeUser: User,
    data: ChangePasswordRequest
  ): Promise<ApiResponse> {
    try {
      const verifyPassword = await hash.verify(
        activeUser.password,
        data.old_password
      );
      if (!verifyPassword) {
        return this.responseService.buildFailure('Wrong old password.');
      }

      const isNewPasswordSame = await hash.verify(
        activeUser.password,
        data.new_password
      );
      if (isNewPasswordSame) {
        return this.responseService.buildFailure(
          'New password is same as old password.',
          null
        );
      }

      const userId = activeUser.id;

      const user = await User.query()
        .where('id', userId)
        .preload('roles')
        .first();

      if (!user) {
        return this.responseService.buildFailure('User does not exist.');
      }

      if (user.roles.length > 0 && data.new_password) {
        user.password = data.new_password;
      }
      await user.save();
      return this.responseService.buildSuccess(
        'Password updated successfully.'
      );
    } catch (error) {
      this.responseService.buildLogger('error', error);
      return this.responseService.buildFailure(
        'Error in updating user details, please try again later.',
        error.stack
      );
    }
  }

  async updateProfile(
    data: ProfileUpdateData,
    auth: Authenticator<Authenticators>
  ): Promise<ApiResponse> {
    const user = auth.user as User;

    if (!user?.isActive) {
      return this.responseService.buildFailure(
        'Account is temporarily suspended'
      );
    }

    const emailExists = await User.query()
      .where('email', data.email)
      .andWhereNot('id', user.id)
      .first();

    if (emailExists) {
      return this.responseService.buildFailure(
        'Email already exists'
      );
    }

    try {
      user.first_name = data.first_name;
      user.last_name = data.last_name;
      user.email = data.email;
      await user.save();

      return this.responseService.buildSuccess('Profile updated successfully');
    } catch (error) {
      // Log the error for debugging purposes and return a failure response
      this.responseService.buildLogger('error', error);
      return this.responseService.buildFailure(
        'Something went wrong while updating the user profile, please try again later'
      );
    }
  }

}

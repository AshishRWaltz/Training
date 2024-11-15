/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
import User from '#models/user'
import { DateTime } from 'luxon'
import { AddUserData, ListCriteria, UserProfileUpdateData, UsersDataResponse } from '../types/user_interface.js'
import ResponseService from './response_service.js'
import { inject } from '@adonisjs/core'
import { ApiResponse } from '../types/response_interface.js'

@inject()
export default class UsersService {
    constructor(private responseService: ResponseService) { }

    public async masterlist(criteria: ListCriteria): Promise<ApiResponse> {
        try {
            const tempRecords = User.query()
                .select([
                    'id',
                    'firstName',
                    'lastName',
                    'email',
                    'password',
                    'createdAt',
                    'updatedAt'
                ])
                .if(criteria.search, (builder) => {
                    builder.where((query) => {
                        query.where('firstName', 'LIKE', `%${criteria.search}`);
                        query.orWhere('lastName', 'LIKE', `%${criteria.search}`);
                        query.orWhere('email', 'LIKE', `%${criteria.search}`);
                    })
                })
                .if(criteria.orderby === 'createdAt', (builder) => {
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

            let limit = Math.abs(criteria.limit || 10);
            let page = Math.abs(criteria.page || 1);

            // Fetch master list based on criteria:

            let masterListResp = await this.masterlist(criteria)

            if (masterListResp.status === 'failure') {
                return masterListResp;
            }

            // Order Records by descending ID and paginate: 
            masterListResp.data = masterListResp.data.orderBy('id', 'desc');
            let records = await masterListResp.data.paginate(page, limit);

            records = records.serialize();

            const _data = {
                records: records.data,
                pagination: {
                    page: records.meta.currentPage,
                    limit: records.meta.limit,
                    totalPages: records.meta.lastPage,
                    totalCount: records.meta.total
                }
            }

            return this.responseService.buildSuccess('Users Data is Fetched successfully for the given Criteria', _data)
        } catch (error) {
            this.responseService.buildLogger('error', error);
            return this.responseService.buildFailure('Error Fetching Users Data')
        }
    }

    public details = async (criteria: ListCriteria) => {
        try {
            const user = await User.query().select([
                'id',
                'firstName',
                'lastName',
                'email',
                'password',
                'createdAt',
                'updatedAt'
            ])
                .where('id', criteria.id).first()

            if (!user) {
                return this.responseService.buildFailure('User not found', [])
            }

            return this.responseService.buildSuccess('User Data Fetched Successfully', user)

        } catch (error) {
            this.responseService.buildLogger('error', error);
            return this.responseService.buildFailure('Error Fetching User Data, Please try again later ')
        }
    }

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

        const emailExists = await User.query().where('email', data.email).first();

        if (emailExists) {
            return this.responseService.buildFailure('Email already in use')
        };

        try {
            // Create a new instance of the User model
            const user = new User()
            user.firstName = data.firstName
            user.lastName = data.lastName
            user.email = data.email
            user.password = data.password
            user.createdAt = data.createdAt
            user.updatedAt = null

            // Save the user to the database
            await user.save();

            return this.responseService.buildSuccess('User added successfully');
        } catch (error) {
            this.responseService.buildLogger('error', error)
            return this.responseService.buildFailure('Error Adding User')
        }
    };


    /**
     * The method is used for updating a user in the database.
     * 
     * @param {UserProfileUpdateData} data - The data object containing the user details.
     * @returns {Promise<ApiResponse>} - The response object containing the status and data.
      */
    public update = async (data: UserProfileUpdateData): Promise<ApiResponse> => {

        // Check if the User is Authenticated and load their associated roles and permissions

        // Check if the authenticated user's account is active or not else throw error adn failed request

        // Check if the provided email is already in use;

        const mobileExists = await User.query().where('email', data.email).first();

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
            user.firstName = data.firstName ? data.firstName : user.firstName
            user.lastName = data.lastName ? data.lastName : user.lastName
            user.email = data.email ? data.lastName : user.email
            user.password = data.password ? data.lastName : user.password

            // Save the user
            await user.save();

            return this.responseService.buildSuccess('User updated successfully');
        } catch (error) {
            this.responseService.buildLogger('error', error);
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
            return this.responseService.buildSuccess('User deleted successfully');
        } catch (error) {
            this.responseService.buildLogger('error', error);
            return this.responseService.buildFailure('Error Deleting User')
        }
    }
}

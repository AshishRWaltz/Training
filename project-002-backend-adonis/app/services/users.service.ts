/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
import User from '#models/user'
import { DateTime } from 'luxon'
import { AddUserData, ApiResponse, ListCriteria, UsersDataResponse } from '../types/users.js'
import ResponseService from './response.service.js'
import { inject } from '@adonisjs/core'

@inject()
export default class UsersService {
    constructor(private responseService: ResponseService) { }

    public async masterlist(criteria: ListCriteria): Promise<ApiResponse<UsersDataResponse>> {
        try {
            const usersTable = User.table

            const tempRecords = User.query()
                .select('*')
                .orderBy(criteria.orderby)
                .limit(criteria.limit)
                .offset((criteria.page - 1) * criteria.limit)

            return this.responseService.buildSuccess('Users Data Fetched Successfully', tempRecords).data
        } catch (error) {
            console.log(error)
            return this.responseService.buildFailure('Error Fetching Users Data', []).data
        }
    }

    public list = async (criteria: ListCriteria): Promise<ApiResponse<UsersDataResponse>> => {
        try {
            const _tempRecords = await User.query()
                .select('*')
                .orderBy('id', criteria.orderby)
                .limit(criteria.limit)
                .offset((criteria.page - 1) * criteria.limit)

            return this.responseService.buildSuccess('Users Data is Fetched successfully for the given Criteria', _tempRecords).data
        } catch (error) {
            console.error(error);
            return this.responseService.buildFailure('Error Fetching Users Data', []).data
        }
    }

    public create = async (data: AddUserData) => {
        try {
            const user = new User()
            user.firstName = data.firstName
            user.lastName = data.lastName
            user.email = data.email
            user.password = data.password
            user.createdat = data.createdat
            user.updatedat = null
            await user.save()

            return this.responseService.buildSuccess('User added successfully');

        } catch (error) {

            console.error(error);
            return this.responseService.buildFailure('Error Adding User', [])

        }
    }

    public update = async (userId: number, data: { id: number; firstName: string; lastName: string; email: string; password: string; createdAt: DateTime; updatedAt: DateTime; }): Promise<ApiResponse<User>> => {

        try {
            const user = await User.query().where('id', userId).first()
            if (!user) {
                return this.responseService.buildFailure('User not found', [])
            }
            user.firstName = data.firstName
            user.lastName = data.lastName
            user.email = data.email
            user.password = data.password
            user.createdAt = data.createdAt
            user.updatedAt = data.updatedAt
            const newUser = await user.save()

            return this.responseService.buildSuccess('User updated successfully', [newUser]);
        } catch (error) {
            console.error(error);
            return this.responseService.buildFailure('Error Updating User', [])
        }
    }

    public delete = async (id: number): Promise<ApiResponse<User>> => {
        try {
            const user = await User.query().where('id', id).first()
            if (!user) {
                return this.responseService.buildFailure('User not found', [])
            }
            await user.delete()
            return this.responseService.buildSuccess('User deleted successfully').data;
        } catch (error) {
            console.error(error);
            return this.responseService.buildFailure('Error Deleting User', []).data
        }
    }
}

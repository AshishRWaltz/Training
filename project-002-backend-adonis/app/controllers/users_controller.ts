/* eslint-disable prettier/prettier */
// import type { HttpContext } from '@adonisjs/core/http'

import ResponseService from "#services/response_service";
import UsersService from "#services/users_service";
import { HttpContext } from "@adonisjs/core/http";
import { AddUserData, ListCriteria } from "../types/user_interface.js";
import { inject } from "@adonisjs/core";

@inject()
export default class UsersController {
    constructor(
        private responseService: ResponseService,
        private userService: UsersService
    ) { }

    /**
     * Handles GET /users API endpoint. Fetches users from the database
     * based on the query string parameters.
     *
     * @param {HttpContext} ctx
     * @property {number} [ctx.request.query().page=1] - Page number
     * @property {number} [ctx.request.query().limit=10] - Number of records per page
     * @property {string} [ctx.request.query().search=''] - Search query
     * @property {string} [ctx.request.query().sortby='createdat'] - Field to sort by
     * @property {string} [ctx.request.query().orderby='desc'] - Order of sorting
     * @property {string} [ctx.request.query().order='desc'] - Order of sorting
     *
     * @returns {ApiResponse<UsersDataResponse>}
     */
    async list({ request, response }: HttpContext) {

        try {
            const queryString = request.all()
            const criteria: ListCriteria = {
                id: queryString?.id || 0,
                order: queryString?.order || "desc",
                sortby: queryString?.sortby || 'createdat',
                orderby: queryString?.orderby || 'desc',
                limit: queryString?.limit || 10,
                page: queryString?.page || 1,
                search: queryString?.search || ''
            }

            const activityResponse = await this.userService.list(criteria);
            return this.responseService.sendResponse(response, activityResponse);

        } catch (error) {
            this.responseService.buildLogger('error', error);

            return this.responseService.sendResponse(response, this.responseService.buildFailure('Error Fetching Users Data'));
        }
    }

    /**
     * Retrieves user details by user ID.
     *
     * @param {HttpContext} ctx - The HTTP context containing request and response objects.
     * @returns {Promise<ApiResponse<UsersDataResponse>>} - A promise that resolves with the user data or an error message.
     * @throws Will return a 500 status code if an error occurs during fetching.
     */
    async show({ request, response }: HttpContext) {
        try {
            const userId = request.param('id');
            return await this.userService.list({ limit: 1, page: 1, search: '', order: 'desc', orderby: 'createdAt', sortby: 'createdAt', id: userId });
        } catch (error) {
            console.error(error);
            return response.status(500).send({ status: 'failure', message: 'Error fetching user' });
        }
    }

    /**
     * Handles POST /users API endpoint. Creates a new user.
     *
     * @param {HttpContext} ctx
     * @property {AddUserData} ctx.request.body - User data
     *
     * @returns {ApiResponse<UsersDataResponse>}
     */

    async store({ request, response }: HttpContext) {
        try {
            const data = request.all() as AddUserData
            return this.userService.create(data);
        } catch (error) {
            console.log(error)
            return response.status(500).send({ status: 'failure', message: 'Error creating user' })
        }
    }

    async update({ request, response }: HttpContext) {
        try {
            const data = request.all() as AddUserData
            return this.userService.update(data as any)
        } catch (error) {
            console.error(error)
            return response.status(500).send({ status: 'failure', message: 'Error updating user' })
        }
    }

    async delete({ request, response }: HttpContext) {
        try {
            const userId = request.param('id');
            return this.userService.delete(userId)
        } catch (error) {
            console.error(error)
            return response.status(500).send({ status: 'failure', message: 'Error deleting user' })
        }
    }

}
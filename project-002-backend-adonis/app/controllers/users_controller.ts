/* eslint-disable prettier/prettier */
// import type { HttpContext } from '@adonisjs/core/http'

import ResponseService from "#services/response.service";
import UsersService from "#services/users.service";
import { HttpContext } from "@adonisjs/core/http";
import { AddUserData, User, UsersDataResponse } from "../types/users.js";
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
    async getUsers({ request, response }: HttpContext) {

        try {
            const queryString = request.all()
            const criteria = {
                order: queryString?.order || "desc",
                sortby: queryString?.sortby || 'createdat',
                orderby: queryString?.orderby || 'desc',
                limit: queryString?.limit || 10,
                page: queryString?.page || 1,
                search: queryString?.search || ''
            }

            return (await this.userService.list(criteria))
        } catch (error) {
            console.error(error)
            return response.status(500).send({ status: 'failure', message: 'Error fetching users' })
        }
    }


    async getUser({ request, response }: HttpContext) {
        try {
            const userId = request.param('id');
            return await this.userService.list({ limit: 1, page: 1, search: '', order: 'desc', orderby: 'createdat', sortby: 'createdat', id: userId })
        } catch (error) {
            console.error(error)
            return response.status(500).send({ status: 'failure', message: 'Error fetching user' })
        }
    }


    async createUser({ request, response }: HttpContext) {
        try {
            const data = request.all() as AddUserData
            return this.userService.create(data)



        } catch (error) {
            console.log(error)
            return response.status(500).send({ status: 'failure', message: 'Error creating user' })
        }
    }

    async updateUser({ request, response }: HttpContext) {

        try {
            const userId = request.param('id');
            const data = request.all() as AddUserData
            return this.userService.update(userId, data as any)
        } catch (error) {
            console.error(error)
            return response.status(500).send({ status: 'failure', message: 'Error updating user' })
        }
    }

    async deleteUser({ request, response }: HttpContext) {
        try {
            const userId = request.param('id');
            return this.userService.delete(userId)
        } catch (error) {
            console.error(error)
            return response.status(500).send({ status: 'failure', message: 'Error deleting user' })
        }
    }

}
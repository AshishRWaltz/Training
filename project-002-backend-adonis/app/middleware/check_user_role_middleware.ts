import { NextFn } from "@adonisjs/core/types/http";
import { HttpContext } from "@adonisjs/core/http";
import User from "#models/user";

/**
 * Checks if the user has a specific role.
 *
 * @param {User | null} user - The user object.
 * @param {string} role - The role to check against.
 * @returns {boolean} - True if the user has the specified role, false otherwise.
 */
export const hasRole = (user: User | null, role: string): boolean => {
    return user?.roles?.some((roleData: { slug: string }) => roleData.slug === role) || false
}

export default class CheckUserRoleMiddleware {
    public async handle({
        auth, request, response
    }: HttpContext, next: NextFn) {
        /**
         * Code for middleware goes here. Above the next line there should only be
         * imports and the variable declarations.
         *
         * Make sure to `await next()` if the middleware is not the last one
          */

        try {
            // Check if then current route contains '/admin/'
            const isAdminRoute = request.url().includes('admin')

            // Get the Authenticated User
            const user = auth.user as User
            await user.load('roles')

            // Verify if the user is an Admin

            const isUserAdmin = 
        } catch (error) {

        }
    }
}
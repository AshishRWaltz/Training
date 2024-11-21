/* eslint-disable prettier/prettier */
const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')
const AccountSettingController = () => import('#controllers/account_setting_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const apiPrefix = '/api/v1/'
router.group(() => {
  router
    .group(() => {
      router.post('/login', [AuthController, 'login']) // User login
      router.post('/logout', [AuthController, 'logout']).use(middleware.auth()) // Requires authentication
      router.post('/password/forgot', [AuthController, 'forgotPassword']) // Request password reset
      router.get('/password/verify_token/:token', [AuthController, 'verifyToken']) // Verify password reset token
      router.post('/password/reset', [AuthController, 'resetPassword']) // Reset password
      // router.post('/register', [AuthController, 'register'])
    })
    .prefix(`${apiPrefix}auth`)




  /* User Own Account Settings Routes */
  router
    .group(() => {
      router.post('/password/change', [AccountSettingController, 'changePassword']) // Change password
      router.post('/profile/update', [AccountSettingController, 'updateProfile']) // Update profile
      router.get('/profile', [AccountSettingController, 'getProfile']) // Get profile details
    })
    .prefix(`${apiPrefix}account_settings`)
    .use([middleware.auth(), middleware.checkUserRole()])

  router
    .group(() => {
      router.get(`/`, [UsersController, 'list'])
      router.get(`/:id`, [UsersController, 'view']).where('id', {
        match: /^[0-9]/,
        cast: (id) => Number(id),
      })
      router.patch(`/:id`, [UsersController, 'update']).where('id', {
        match: /^[0-9]/,
        cast: (id) => Number(id),
      })
      router.put(`/:id`, [UsersController, 'update']).where('id', {
        match: /^[0-9]/,
        cast: (id) => Number(id),
      })
      router.delete(`/:id`, [UsersController, 'delete']).where('id', {
        match: /^[0-9]/,
        cast: (id) => Number(id),
      })
      router.post(`/`, [UsersController, 'addUser'])
    })
    .prefix(`${apiPrefix}users`)
})

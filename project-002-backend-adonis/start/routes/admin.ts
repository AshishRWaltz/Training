const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const AccountSettingController = () => import('#controllers/account_setting_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const apiAdminPrefix = 'api/v1/admin/'

router.get(apiAdminPrefix, async () => {
  return {
    message: 'Admin Routes Api Admin Prefix Working',
  }
})

/* Admin Will Have the Authentication to Create User, View User, Update user, Delete User, Change Password, Login, Logout, Reset Password, Verify Token , Forget Passwword */

//   User Management Routes
router
  .group(() => {
    router.get(`/`, [UsersController, 'list']) //List Users
    router.get(`/:id`, [UsersController, 'view']).where('id', {
      match: /^[0-9]/,
    }) // View User By ID
    router.put('/:id', [UsersController, 'update']).where('id', {
      match: /^[0-9]/,
    }) //update user by ID
    router.post(`/`, [UsersController, 'addUser']) // Create User By Admin
    router.delete(`/:id`, [UsersController, 'delete']).where('id', {
      match: /^[0-9]/,
    }) // Delete User By ID
  })
  .prefix(`${apiAdminPrefix}users`)
  .use([middleware.auth(), middleware.checkUserRole()])


// Account Settings Routes
router
  .group(() => {
    router.post('/password/change', [AccountSettingController, 'changePassword'])
    router.post('/profile/update', [AccountSettingController, 'updateProfile']) // Update profile
    router.get('/profile', [AccountSettingController, 'getProfile']) // Get profile details
  })
  .prefix(`${apiAdminPrefix}account_settings`)
  .use([middleware.auth(), middleware.checkUserRole()])

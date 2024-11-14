/* eslint-disable prettier/prettier */
const UsersController = () => import('#controllers/users_controller')
import router from '@adonisjs/core/services/router'

const apiPrefix = 'api/v1/'
router.group(() => {
    router.get('/api/v1/users',
        // async () => {
        //     return "Getting Users"
        // }
        [
            UsersController, "getUsers"

        ]
    )
    router.get('/api/v1/users/:id',
        // async () => {
        //     return "Getting Single Users"
        // }
        [
            UsersController, "getUser"

        ]
    )
    router.put('/api/v1/users/:id',
        // async () => {
        //     return "Updating Given User"
        // }
        [
            UsersController, "updateUser"

        ]
    )
    router.delete('/api/v1/users/:id',
        // async () => {
        //     return "Deleting Given User"
        // }
        [
            UsersController, "deleteUser"

        ]
    )
    router.post('/api/v1/users/',
        // async () => {
        //     return "Getting Users"
        // }
        [
            UsersController, "createUser"

        ]
    )
})
// .prefix(`${apiPrefix}users`)
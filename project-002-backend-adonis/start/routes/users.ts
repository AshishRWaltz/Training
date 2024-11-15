/* eslint-disable prettier/prettier */
const UsersController = () => import("#controllers/users_controller");
import router from "@adonisjs/core/services/router";

const apiPrefix = "/api/v1/";
router
    .group(() => {
        router.get(`/`, [UsersController, "list"]);
        router.get(`/:id`, [UsersController, "getUser"]);
        router.patch(`/:id`, [UsersController, "updateUser"]);
        router.put(`/:id`, [UsersController, "updateUser"]);
        router.delete(`/:id`, [UsersController, "deleteUser"]);
        router.post(`/`, [UsersController, "createUser"]);
    })
    .prefix(`${apiPrefix}users`);

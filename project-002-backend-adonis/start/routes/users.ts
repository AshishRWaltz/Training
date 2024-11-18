/* eslint-disable prettier/prettier */
const UsersController = () => import("#controllers/users_controller");
import router from "@adonisjs/core/services/router";

const apiPrefix = "/api/v1/";
router
    .group(() => {
        router.get(`/`, [UsersController, "list"]);
        router.get(`/:id`, [UsersController, "show"]).where("id", {
            match: /^[0-9]/,
            cast: (id) => Number(id),
        });
        router.patch(`/:id`, [UsersController, "update"]).where("id", {
            match: /^[0-9]/,
            cast: (id) => Number(id),
        });
        router.put(`/:id`, [UsersController, "update"]).where("id", {
            match: /^[0-9]/,
            cast: (id) => Number(id),
        });
        router.delete(`/:id`, [UsersController, "delete"]).where("id", {
            match: /^[0-9]/,
            cast: (id) => Number(id),
        });
        router.post(`/`, [UsersController, "store"]);
    })
    .prefix(`${apiPrefix}users`);

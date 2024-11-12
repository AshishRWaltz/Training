export const mainRoutes = [
    {
        path: '/',
        element: <Users />
    },
    {
        path: '/users',
        element: <Users />
    },
    {
        path: '/users/:id',
        element: <User />
    },
    {
        path: '/users/create-user',
        element: <CreateUser />
    }
]
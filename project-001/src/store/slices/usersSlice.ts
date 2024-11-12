import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UsersState } from "../../types/users";

const initialState: UsersState = {
    users: [],
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
}

// export const fetchUsersThunk = createAsyncThunk(
//     'users/fetchUsers',
//     async ({ page, limit, search }: { page: number; limit: number; search: string }) => {
//         return await fetchUsers(page, limit, search);
//     }
// );

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setLimit: (state, action: PayloadAction<number>) => {
            state.limit = action.payload;
        },
        getUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
        },
        createUser: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload);
        },
        updateUser: (state, action: PayloadAction<User>) => {
            const userIndex = state.users.findIndex((user) => user.id === action.payload.id);
            if (userIndex) {
                state.users[userIndex] = action.payload;
            }
        },
        deleteUser: (state, action: PayloadAction<string>) => {
            const userIndex = state.users.findIndex((user) => user.id === action.payload)
            if (userIndex) {
                state.users.splice(userIndex, 1);
            }
        },
        getUser: (state, action: PayloadAction<User>) => {
            const userIndex = state.users.findIndex((user) => user.id === action.payload.id);
            if (userIndex) {
                state.users[userIndex] = action.payload;
            }
        }

    }
});

export const { getUsers } = usersSlice.actions;

export default usersSlice.reducer;
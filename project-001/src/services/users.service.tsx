import { ApiResponse } from "../types/api";
import {
  User,
  UserDeleteResponse,
  userGetResponse,
  usersResponse,
  UserUpdateResponse,
} from "../types/users";
import axiosService from "./axios.service";

const getUsers = async (
  limit?: number,
  page?: number,
  searchTerm?: string
): Promise<ApiResponse<usersResponse>> => {
  const _limit = limit || 10;
  const _page = page || 1;
  const _searchTerm = searchTerm || "";
  const _response = await axiosService.get(
    `users?page=${_page}&limit=${_limit}${
      _searchTerm && "&name_eq=" + _searchTerm
    }`
  );
  return { data: _response.data, status: "success", message: "All Users" };
};
const createUser = async (formData: User): Promise<ApiResponse<User>> => {
  const _response = await axiosService.post<ApiResponse<User>>(
    "/users/create-user",
    formData
  );
  return _response.data;
};

const getUser = async (id: string): Promise<ApiResponse<userGetResponse>> => {
  const _response = await axiosService.get(`/users/${id}`);
  return _response.data;
};

const updateUser = async (
  id: string,
  _data: any
): Promise<ApiResponse<UserUpdateResponse>> => {
  const _response = await axiosService.put<ApiResponse<UserUpdateResponse>>(
    `/users/${id}`,
    {
      ..._data,
    }
  );
  return _response.data;
};

const deleteUser = async (
  id: string
): Promise<ApiResponse<UserDeleteResponse>> => {
  const response = await axiosService.delete<ApiResponse<UserDeleteResponse>>(
    `/users/${id}`
  );
  return response.data;
};

// const searchUsers = async (
//   searchTerm: string | null
// ): Promise<ApiResponse<User[]>> => {
//   if (!searchTerm) {
//     const _response = await axiosService.get(`users`);
//     return _response.data;
//   }
//   const _response = await axiosService.get(`users?name_eq=${searchTerm}`);
//   return _response.data;
// };

const UsersService = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  // setPage,
  // setLimit,
  // searchUsers,
  // setSort,
  // setFilter
};

export default UsersService;

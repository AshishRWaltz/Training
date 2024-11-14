import { ApiResponse } from "../types/api";
import {
  User,
  UserCreateResponse,
  UserDeleteResponse,
  userGetResponse,
  usersResponse,
  UserUpdateResponse,
} from "../types/users";
import axiosService from "./axios.service";
const getUsers = async (
  limit?: number,
  page?: number,
  searchTerm?: string,
  order: string = "desc",
  orderBy: string = "createdat",
  sortBy: string = "createdat"
): Promise<ApiResponse<usersResponse>> => {
  const _limit = limit || 10;
  const _page = page || 1;
  const _searchTerm = searchTerm || "";
  const _order = order;
  const _orderBy = orderBy;
  const _sortBy = sortBy;

  const _response = await axiosService.get(
    `users?page=${_page}&limit=${_limit}${
      _searchTerm && "&search=" + _searchTerm
    }${_order && "&order=" + _order}${_orderBy && "&orderBy=" + _orderBy}${
      _sortBy && "&sortBy=" + _sortBy
    }`
  );

  const _responseAllUsers = await axiosService.get(`/users`);

  return {
    data: _response.data,
    status: "success",
    message: "All Users",
  };
};
const createUser = async (
  formData: User
): Promise<ApiResponse<UserCreateResponse>> => {
  console.log(formData);
  const response = await axiosService.post<ApiResponse<UserCreateResponse>>(
    "/users",
    formData
  );
  return response.data;
};

const getUser = async (id: string): Promise<User> => {
  const _response = await axiosService.get<User>(`/users/${id}`);
  console.log("aaa", _response.data);
  return _response.data;
};

const updateUser = async (
  id: string,
  _data: any
): Promise<ApiResponse<UserUpdateResponse>> => {
  console.log("Data for user: ", id, " :", _data);
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

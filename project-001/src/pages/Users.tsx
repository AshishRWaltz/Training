import React, { useEffect, useState } from "react";
import UsersService from "../services/users.service";
import usersDataJSON from "../services/data.json";
import { CiViewBoard } from "react-icons/ci";
import { Link, useSearchParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import AddUser from "../components/users/AddUser";
import { CgAddR } from "react-icons/cg";
import SearchBar from "../components/users/SearchBar";
import { SimplePagination } from "../components/layout/PaginationComponent";
import { User, usersResponse } from "../types/users";
import { ApiResponse } from "../types/api";

const Users: React.FC = () => {
  // Correctly initialize useState with usersDataJSON

  const [usersDataLoading, setUsersDataLoading] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const currentPage = params.get("page");
  const currentLimit = params.get("limit");
  const currentSearch = params.get("name_eq");

  const [page, setPage] = useState(currentPage ? Number(currentPage) : 1);
  const [limit, setLimit] = useState(currentLimit ? Number(currentLimit) : 10);
  const [search, setSearch] = useState<string>(
    currentSearch ? currentSearch : ""
  );

  const [users, setUsers] = useState<User[]>([]);

  const totoalPages = Math.max(Math.ceil(users?.length / limit), 1);

  const getItemProps = (index: number) => ({
    variant: page === index ? "filled" : "text",
    color: "gray",
    onClick: () => setPage(index),
  });

  const next = () => {
    if (page === 5) return;
    setPage(page + 1);
    console.log(page + 1);
  };

  const prev = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isComfiramationModalOpen, setIsComfiramationModalOpen] = useState(
    false
  );
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const toggleConfiramationModal = (userId: string | null) => {
    setSelectedUser(userId);
    setIsComfiramationModalOpen(!isComfiramationModalOpen);
  };

  const toggleAddUserModal = () => {
    setIsAddUserModalOpen(!isAddUserModalOpen);
  };

  const handleDeleteUser = async (userID: string) => {
    try {
      await UsersService.deleteUser(userID);
      setUsers(users.filter((user: User) => user.id !== userID));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUser = async (user: User) => {
    try {
      await UsersService.createUser(user);
      setUsers([...users, user]);
      toggleAddUserModal();
    } catch (error) {
      console.error(error);
    }
    toggleAddUserModal();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersDataLoading(true);
      try {
        const response: ApiResponse<usersResponse> = await UsersService.getUsers(
          limit,
          page,
          search
        );
        console.log("All Users: ", response.data);
        setUsers(
          response?.data?.filter((user: User) => {
            return user.name.toLowerCase().includes(search.toLowerCase());
          })
        );
        setUsersDataLoading(false);
      } catch (error) {
        console.error(error);
      }
      setUsersDataLoading(false);
    };

    fetchUsers();
  }, [page, limit, search]);

  return (
    <main className="w-full bg-gray-200 ">
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleAddUserModal();
        }}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 flex flex-row flex-nowrap gap-2 items-center justify-center"
      >
        <CgAddR />
        Add New User
      </button>
      <SearchBar setSearchTerm={setSearch} />
      {usersDataLoading ? (
        <div className="flex items-center justify-center ">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <table className="table-auto w-full">
          <thead className="bg-gray-400 w-full">
            <tr>
              {/* <th>ID</th> */}
              <th className=" min-w-20">Name</th>
              <th className=" min-w-20">Email</th>
              <th className=" min-w-20">Phone</th>
              <th className=" min-w-20">Address</th>
              <th className=" min-w-20">Company</th>
              <th className=" min-w-20">Delete User</th>
              <th className=" min-w-20">View</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {users?.length > 0 ? (
              users?.map((user) => (
                <tr
                  className=" even:bg-gray-300 border-b w-full"
                  key={user?.id}
                >
                  {/* <td className="text-center min-w-40  ">{user?.id}</td> */}
                  <td className="text-center min-w-40  ">{user?.name}</td>
                  <td className="text-center min-w-40  ">{user?.email}</td>
                  <td className="text-center min-w-40  ">{user?.phone}</td>
                  <td className="text-center min-w-40  ">
                    {user?.address?.street}, {user?.address?.city},{" "}
                    {user?.address?.city}, {user?.address?.zipcode}
                  </td>
                  <td className="text-center min-w-40  ">
                    {user?.company?.name}
                  </td>

                  <td className="text-center min-w-40  ">
                    <button
                      onClick={() => toggleConfiramationModal(user?.id)}
                      className="text-center"
                    >
                      <MdDelete />
                    </button>
                  </td>
                  <td className="text-center min-w-40  ">
                    <Link className="text-center" to={`/user/${user?.id}`}>
                      <CiViewBoard />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="w-full">
                <td className="text-center w-full " colSpan={8}>
                  No Users Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <SimplePagination
        page={page}
        limit={limit}
        total={totoalPages}
        next={next}
        prev={prev}
        setLimit={setLimit}
        setPage={setPage}
      />

      {selectedUser && isComfiramationModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => toggleConfiramationModal(null)}
        >
          <div className="bg-white p-4 rounded-md">
            <p>Are you sure you want to delete this user?</p>
            <div className="flex justify-end mt-4">
              <button
                className="mr-2 px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={() => toggleConfiramationModal(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md"
                onClick={() => handleDeleteUser(selectedUser)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
            <AddUser
              handleAddUser={handleAddUser}
              toggleAddUserModal={toggleAddUserModal}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default Users;

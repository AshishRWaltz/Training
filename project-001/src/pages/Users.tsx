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

// Logging user data
console.log("Users Data:", usersDataJSON);

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

  const [users, setUsers] = useState([]);

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

  const toggleConfiramationModal = (userId: string) => {
    setSelectedUser(userId);
    setIsComfiramationModalOpen(!isComfiramationModalOpen);
  };

  const toggleAddUserModal = () => {
    setIsAddUserModalOpen(!isAddUserModalOpen);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersDataLoading(true);
      try {
        const response = await UsersService.getUsers(limit, page, search);
        console.log("All Users: ", response.data);
        setUsers(response?.data);
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
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <table className="table-auto">
          <thead className="bg-gray-400 w-full">
            <tr>
              {/* <th>ID</th> */}
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Birthday</th>
              <th>Is Active?</th>
              <th className="">Delete User</th>
              <th className="">View</th>
            </tr>
          </thead>
          <tbody>
            {users?.length > 0 ? (
              users?.map((user) => (
                <tr className=" even:bg-gray-300 border-b" key={user?.id}>
                  {/* <td className="text-center ">{user?.id}</td> */}
                  <td className="text-center ">{user?.name}</td>
                  <td className="text-center ">{user?.email}</td>
                  <td className="text-center ">{user?.phone}</td>
                  <td className="text-center ">
                    {user?.address?.street}, {user?.address?.city},{" "}
                    {user?.address?.country}, {user?.address?.zipcode}
                  </td>
                  <td className="text-center ">{user?.birthdate}</td>
                  <td className="text-center ">
                    {user?.isActive ? "Yes" : "No"}
                  </td>
                  <td className="text-center ">
                    <button
                      onClick={() => toggleConfiramationModal(user?.id)}
                      className="text-center"
                    >
                      <MdDelete />
                    </button>
                  </td>
                  <td className="text-center ">
                    <Link to={`/user/${user?.id}`}>
                      <CiViewBoard />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center" colSpan={8}>
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
                onClick={() => {
                  toggleConfiramationModal(null);
                  UsersService.deleteUser(selectedUser);
                }}
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
            <AddUser toggleAddUserModal={toggleAddUserModal} />
          </div>
        </div>
      )}
    </main>
  );
};

export default Users;

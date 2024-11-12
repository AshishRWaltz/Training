import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { AddUserProps, User as UserType } from "../../types/users";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CgClose } from "react-icons/cg";

const schema = yup.object().shape({
  // id: yup.string().required("ID is required").uuid("Invalid UUID"),
  lastName: yup.string().required("lastName is required"),
  firstName: yup.string().required("First name is required"),
  phone: yup.string().required("Phone is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  createdAt: yup.date(),
  updatedAt: yup.date(),
});

const AddUser: React.FC<AddUserProps> = ({
  handleAddUser,
  toggleAddUserModal,
}) => {
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserType>({
    // resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: UserType) => {
    console.log(data);
    await handleAddUser(data);
  };

  return (
    <main className="relative  max-h-[70vh] overflow-y-auto">
      <button
        type="button"
        className="absolute top-2 right-2"
        onClick={() => {
          toggleAddUserModal();
        }}
      >
        <CgClose />
      </button>
      <header className="px-2 py-2 bg-gray-300  flex justify-between">
        <div className="">Create New User</div>
      </header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-2 py-2  w-full flex flex-col gap-4"
      >
        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="min-w-20">First Name</label>
          <input
            {...register("firstName")}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder=" First Name"
          />
        </div>
        {errors.firstName && (
          <span className="text-red-600">**{errors.firstName.message}</span>
        )}
        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="min-w-20">Last Name</label>
          <input
            {...register("lastName")}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder="Username"
          />
        </div>
        {errors.lastName && (
          <span className="text-red-600">**{errors.lastName.message}</span>
        )}

        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="min-w-20">Password</label>
          <input
            {...register("password")}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder="password"
          />
        </div>
        {errors.password && (
          <span className="text-red-600">**{errors.password.message}</span>
        )}

        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="min-w-20">Email</label>
          <input
            {...register("email")}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder="Email ID"
          />
        </div>
        {errors.email && (
          <span className="text-red-600">**{errors.email.message}</span>
        )}

        {
          <section className="flex justify-end gap-4">
            <button type="submit" className="px-2 py-2 bg-gray-200">
              {isSubmitting ? "Adding..." : "Add User"}
            </button>
            <button
              type="button"
              onClick={() => toggleAddUserModal()}
              className="px-2 py-2 bg-gray-200"
            >
              Cancel
            </button>
          </section>
        }
      </form>
    </main>
  );
};

export default AddUser;

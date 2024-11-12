import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import UsersData from "../../services/data.json";
import { formatName } from "../../utils/usersUtils";
import { BiEdit } from "react-icons/bi";
import { AddUserProps, User as UserType } from "../../types/users";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CgClose } from "react-icons/cg";

const UserData = [...UsersData];

const schema = yup.object().shape({
  // id: yup.string().required("ID is required").uuid("Invalid UUID"),
  name: yup.string().required("Name is required"),
  username: yup.string().required("Username is required"),
  phone: yup.string().required("Phone is required"),
  address: {
    street: yup.string().required("Street is required"),
    suite: yup.string().required("Suite is required"),
    city: yup.string().required("City is required"),
    zipcode: yup.string().required("Zipcode is required"),
    geo: {
      lat: yup.string().required("Latitude is required"),
      lng: yup.string().required("Longitude is required"),
    },
  },
  website: yup.string().required("Website is required"),
  company: {
    name: yup.string().required("Company name is required"),
    catchPhrase: yup.string().required("Catch phrase is required"),
    bs: yup.string().required("BS is required"),
  },
  email: yup.string().email("Invalid email").required("Email is required"),
});

const AddUser: React.FC<AddUserProps> = ({
  handleAddUser,
  toggleAddUserModal,
}) => {
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserType>({
    resolver: yupResolver(schema),
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
          <label className="min-w-20">Name</label>
          <input
            {...register("name")}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder="User Name"
          />
        </div>
        {errors.name && (
          <span className="text-red-600">**{errors.name.message}</span>
        )}
        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="min-w-20">Username</label>
          <input
            {...register("username")}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder="Username"
          />
        </div>
        {errors.username && (
          <span className="text-red-600">**{errors.username.message}</span>
        )}

        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="min-w-20">Website</label>
          <input
            {...register("website")}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder="Website"
          />
        </div>
        {errors.website && (
          <span className="text-red-600">**{errors.website.message}</span>
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

        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="min-w-20">phone</label>
          <input
            {...register("phone")}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder="Phone Number"
          />
        </div>
        {errors.phone && (
          <span className="text-red-600">**{errors.phone.message}</span>
        )}

        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="min-w-20">Company</label>
          <input
            {...register("company.name")}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder="Company Name"
          />
          <input
            {...register("company.catchPhrase")}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder="Company Catch Phrase"
          />
          <input
            {...register("company.bs")}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder="Company BS"
          />
        </div>
        {errors.company && (
          <span className="text-red-600">**{errors.company.message}</span>
        )}

        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="min-w-20">Address</label>
          <input
            {...register("address.street")}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder="Street"
          />
          <input
            {...register("address.suite")}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder="Suite"
          />
          <input
            {...register("address.city")}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder="City"
          />
          <input
            {...register("address.zipcode")}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder="Zipcode"
          />
        </div>
        {errors.address && (
          <span className="text-red-600">**{errors.address.message}</span>
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

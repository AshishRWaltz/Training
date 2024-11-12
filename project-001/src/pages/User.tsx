import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import UsersData from "../services/data.json";
import { formatName } from "../utils/usersUtils";
import { BiEdit } from "react-icons/bi";
import { User as UserType } from "../types/users";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const UserData = [...UsersData];

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
  birthdate: yup.string().required("Birthdate is required"),
  isActive: yup.boolean().required("isActive is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const User: React.FC = () => {
  const { id } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const [user, setUser] = useState(UsersData.find((user) => user?.id === id));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserType>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...user,
    },
  });

  const onSubmit = (data: UserType) => {
    console.log(data);
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/users/${id}`
        );
        console.log("User: ", response.data);
        setUser(response?.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [id]);
  return (
    <main className="">
      <header className="px-2 py-2 bg-gray-300  flex justify-between">
        <div className="">{formatName(user?.name)}</div>
        {!isEditable && (
          <button
            onClick={() => setIsEditable(!isEditable)}
            className="flex  items-center gap-4"
          >
            {isEditable ? "Cancel" : "Edit"}
            <BiEdit />{" "}
          </button>
        )}
      </header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-2 py-2  w-full flex flex-col gap-4"
      >
        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="">Name</label>
          <input
            {...register("name")}
            readOnly={!isEditable}
            type=""
            className="text-black border border-black px-2 py-2"
            id={user?.name}
            placeholder={user?.name}
          />
        </div>
        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="">Email</label>
          <input
            {...register("email")}
            readOnly={!isEditable}
            type=""
            className="text-black border border-black px-2 py-2"
            id={user?.email}
            placeholder={user?.email}
          />
        </div>
        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="">phone</label>
          <input
            {...register("phone")}
            readOnly={!isEditable}
            type=""
            className="text-black border border-black px-2 py-2"
            id={user?.phone}
            placeholder={user?.phone}
          />
        </div>
        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="">Address</label>
          <input
            {...register("address.city")}
            readOnly={!isEditable}
            type=""
            className="text-black border border-black px-2 py-2"
            id={user?.address}
            placeholder={user?.address?.city}
          />
        </div>
        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="">BirthDay</label>
          <input
            {...register("birthdate")}
            readOnly={!isEditable}
            type=""
            className="text-black border border-black px-2 py-2"
            id={user?.birthdate}
            placeholder={user?.birthdate}
          />
        </div>
        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="">Is Active ?</label>
          <input
            {...register("isActive")}
            readOnly={!isEditable}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder={user?.isActive ? "true" : "false"}
          />
        </div>

        {isEditable && (
          <section className="flex justify-end gap-4">
            <button type="submit" className="px-2 py-2 bg-gray-200">
              Save
            </button>
            <button
              onClick={() => setIsEditable(!isEditable)}
              className="px-2 py-2 bg-gray-200"
            >
              Cancel
            </button>
          </section>
        )}
      </form>
    </main>
  );
};

export default User;

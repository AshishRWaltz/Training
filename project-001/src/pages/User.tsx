import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import { formatName } from "../utils/usersUtils";
import { BiEdit } from "react-icons/bi";
import { User as UserType } from "../types/users";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UsersService from "../services/users.service";

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

const User: React.FC = () => {
  const { id } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const [user, setUser] = useState({} as UserType);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserType>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: user?.name,
      username: user?.username,
      email: user?.email,
      phone: user?.phone,
      address: {
        street: user?.address?.street,
        suite: user?.address?.suite,
        city: user?.address?.city,
        zipcode: user?.address?.zipcode,
        geo: {
          lat: user?.address?.geo?.lat,
          lng: user?.address?.geo?.lng,
        },
      },
      website: user?.website,
      company: {
        name: user?.company?.name,
        catchPhrase: user?.company?.catchPhrase,
        bs: user?.company?.bs,
      },
    },
  });

  const onSubmit = (data: UserType) => {
    console.log(data);
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UsersService.getUser(id as string);
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
          <label className="min-w-40">Name</label>
          <input
            {...register("name")}
            readOnly={!isEditable}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder={user?.name}
          />
        </div>
        {errors?.name && (
          <p className="text-red-500">{errors?.name?.message}</p>
        )}

        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="min-w-40">Username</label>
          <input
            {...register("username")}
            readOnly={!isEditable}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder={user?.username}
          />
        </div>
        {errors?.username && (
          <p className="text-red-500">{errors?.username?.message}</p>
        )}
        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="min-w-40">Email</label>
          <input
            {...register("email")}
            readOnly={!isEditable}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder={user?.email}
          />
        </div>
        {errors?.email && (
          <p className="text-red-500">{errors?.email?.message}</p>
        )}
        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="min-w-40">phone</label>
          <input
            {...register("phone")}
            readOnly={!isEditable}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder={user?.phone}
          />
        </div>
        {errors?.phone && (
          <p className="text-red-500">{errors?.phone?.message}</p>
        )}
        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="min-w-40">Address</label>
          <input
            {...register("address.city")}
            readOnly={!isEditable}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder={user?.address?.city}
          />
          <input
            {...register("address.zipcode")}
            readOnly={!isEditable}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder={user?.address?.zipcode}
          />
          <input
            {...register("address.street")}
            readOnly={!isEditable}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder={user?.address?.street}
          />
          <input
            {...register("address.suite")}
            readOnly={!isEditable}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder={user?.address?.suite}
          />
        </div>
        {errors?.address?.city && (
          <p className="text-red-500">{errors?.address?.city?.message}</p>
        )}
        <div className=" flex flex-col md:flex-row md:gap-4 items-center">
          <label className="min-w-40">Website</label>
          <input
            {...register("website")}
            readOnly={!isEditable}
            type=""
            className="text-black border border-black px-2 py-2"
            placeholder={user?.website}
          />
        </div>
        {errors?.website && (
          <p className="text-red-500">{errors?.website?.message}</p>
        )}
        {isEditable && (
          <section className="flex justify-end gap-4">
            <button type="submit" className="px-2 py-2 bg-gray-200">
              {isSubmitting ? "Saving..." : "Save"}
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

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import { BiEdit, BiHide, BiShow } from "react-icons/bi";
import { User } from "../types/users";
import { useForm } from "react-hook-form";
import UsersService from "../services/users.service";
import { Alert, Spinner } from "../services/notiflix.service";
import { avatar } from "@material-tailwind/react";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  // id: yup.string().required("ID is required").uuid("Invalid UUID"),
  lastName: yup.string().required("lastName is required"),
  firstName: yup.string().required("First name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const UserItem: React.FC = () => {
  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    avatar: "",
    createdAt: "",
    updatedat: "",
  };
  const paramsPassed = useParams();

  const userId = paramsPassed.id;
  const [showpassword, setShowPassword] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const [user, setUser] = useState<User>({ ...defaultValues });

  useEffect(() => {
    console.log("userinfo", user);
  }, [user]);
  const {
    register,
    handleSubmit,
    setValue,
    reset,

    formState: { errors, isSubmitting, isDirty, isSubmitted },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });
  useEffect(() => {
    const fetchUserData = async () => {
      Spinner.show();
      try {
        if (!userId) {
          return;
        }
        const _response = await UsersService.getUser(userId);
        setUser(_response);
        reset(_response);
        Spinner.hide();
      } catch (error) {
        console.error(error);
        Spinner.hide();
        Alert.error("Error in fetching User Data.");
      }
    };
    fetchUserData();
  }, [userId, setUser, reset]);

  const onSubmit = async (data) => {
    Spinner.show();
    try {
      await UsersService.updateUser(userId, {
        ...data,
        updatedat: new Date().toString(),
      });
      Alert.success("Successfully Updated the User Data");
    } catch (error) {
      console.error(error);
      reset();
      Alert.error("Error in Updating the User");
    }
    Spinner.hide();
  };

  return (
    <main className="px-4 py-4">
      <header className="">{}</header>
      {!isEditable && (
        <button
          className="absolute top-4 right-4 flex  flex-row gap-2"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsEditable(!isEditable);
          }}
        >
          <BiEdit /> Edit User
        </button>
      )}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-4 items-center">
          <label className="min-w-40">First Name</label>
          <input
            {...register("firstName")}
            type="text"
            disabled={!isEditable}
            className="border border-black rounded px-2 py-2"
          />
        </div>
        {errors.firstName && (
          <span className="text-red-500">{errors.firstName.message}</span>
        )}

        <div className="flex gap-4 items-center">
          <label className="min-w-40">Last Name</label>
          <input
            {...register("lastName")}
            type="text"
            disabled={!isEditable}
            className="border border-black rounded px-2 py-2"
          />
        </div>
        {errors.lastName && (
          <span className="text-red-500">{errors.lastName.message}</span>
        )}

        <div className="flex gap-4 items-center ">
          <label className="min-w-40">Email</label>
          <input
            {...register("email")}
            type="email"
            disabled={!isEditable}
            className="border border-black rounded px-2 py-2"
          />
        </div>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}

        <div className="flex gap-4 items-center">
          <label className="min-w-40">Password</label>
          <input
            {...register("password")}
            type={showpassword ? "text" : "password"}
            disabled={!isEditable}
            className="border border-black rounded px-2 py-2 relative"
          />
          {showpassword ? (
            <button
              type="button"
              onClick={() => {
                console.log("Showing Password");
                setShowPassword(!showpassword);
              }}
              className="relative top-0 right-10 z-10"
            >
              <BiShow />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                console.log("Showing Password");
                setShowPassword(!showpassword);
              }}
              className="relative top-0 right-10 z-10"
            >
              <BiHide />
            </button>
          )}
        </div>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}

        <div className="flex gap-4 items-center">
          <label className="min-w-40">Created At</label>
          <input
            {...register("createdAt")}
            type="text"
            disabled={true}
            className="border border-black rounded px-2 py-2"
          />
        </div>

        <div className="flex gap-4 items-center">
          <label className="min-w-40">Updated At</label>
          <input
            {...register("updatedat")}
            type="text"
            disabled={true}
            className="border border-black rounded px-2 py-2"
          />
        </div>

        {isEditable && (
          <section className="flex gap-4 flex-row">
            <button
              disabled={!isDirty}
              type="submit"
              className="bg-green-500 rounded-sm px-4 py-2 text-white"
            >
              {isSubmitting ? "Saving" : "Save"}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              className="bg-red-500 rounded-sm px-4 py-2 text-white"
            >
              {"Reset"}
            </button>
          </section>
        )}
      </form>
    </main>
  );
};

export default UserItem;

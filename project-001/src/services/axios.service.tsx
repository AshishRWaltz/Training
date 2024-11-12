import axios, { AxiosResponse } from "axios";
import { store } from "../store";
import { AxiosError } from "axios";
import { ApiResponse } from "../types/api";
import ConfigService from "./config.service";

const axiosService = axios.create({
  baseURL: `${ConfigService.apiBaseUrl()}`,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Origin, Accept,Authorization,Content-Length, X-Requested-With",
    "Allow-Control-Allow-Credentials": true,
  },
});

axiosService.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    console.error("Request Error: ", error);
    return Promise.reject(error);
  }
);

/* Response Interceptor for Handling API Responses And Errors */
axiosService.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<any>) => {
    const { dispatch } = store;
    const response: ApiResponse<null> = {
      status: "failure",
      message: "An error occurred",
      data: null,
    };

    if (error.response?.status === 401) {
      // Handle 401 unauthorized error
      // Show th Notiflix Service Error Message
      response.message = "You are not logged in. Please log in and try again.";
    } else if (error.code === "ERR_NETWORK") {
      // Handle network errors
      // Show Notiflix Error Status
      response.message = "Server Unavailable, Please try again later.";
    } else if (error.response?.status === 500) {
      // Handle server errors
      response.message =
        error.response.data?.message || "Server error occurred.";
      response.data = error.response.data?.data || null;
    } else {
      // Handle other types of errors
      response.message = error.response?.data?.message || error.message;
    }

    return Promise.reject(response);
  }
);
export default axiosService;

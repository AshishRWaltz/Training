import { ApiResponse } from "../types/api";
const buildFailure = <T = null,>(
  _message: string,
  _data: T | null = null
): ApiResponse<T> => {
  return {
    status: "failure",
    message: _message,
    data: _data,
  };
};
const buildSuccess = <T = null,>(
  _message: string,
  _data: T | null = null
): ApiResponse<T> => {
  return {
    status: "success",
    message: _message,
    data: _data,
  };
};

const ResponseService = {
  buildFailure,
  buildSuccess,
};

export default ResponseService;

const buildFailure = (_message: string, _data = null) => {
  return {
    status: "failure",
    message: _message,
    data: _data,
  };
};
const buildSuccess = (_message: string, _data = null) => {
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

const apiBaseUrl = () => {
  return import.meta.env.VITE_APP_API_URL;
};

const appBaseUrl = () => {
  return import.meta.env.VITE_APP_BASE_URL;
};

const appName = () => {
  return import.meta.env.VITE_APP_NAME || "";
};

const appVersion = () => {
  return import.meta.env.VITE_APP_VERSION || "";
};

const ConfigService = {
  apiBaseUrl,
  appBaseUrl,
  appName,
  appVersion,
};

export default ConfigService;

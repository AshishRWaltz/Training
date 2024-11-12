import AxiosService from './axios.service';

const getConfigurationDetails = async () => {
  // try {
  //   let _axiosData = {
  //     method: 'get',
  //     url: 'configuration',
  //     isAuthorized: true,
  //   };
  //   const response = await AxiosService.hit(_axiosData);
  //   return response.data;
  // } catch (error) {
  //   throw Error(error.message);
  // }
};

const configurationService = {
  getConfigurationDetails,
};

export default configurationService;

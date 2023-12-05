import axiosClients from "../AxiosClient";
const LogApi = {
  getLog: (data) => {
    const url = `/log?startDate=${data.startDate}&endDate=${data.endDate}&type=${data.type}`;
    return axiosClients.get(url);
  },
  getUserLog: (data) => {
    const url = `/log/getUserLog`;
    return axiosClients.get(url);
  },
};

export default LogApi;

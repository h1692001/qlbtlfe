import axiosClients from "../AxiosClient";
const BTLApi = {
  uploadBTL: (data) => {
    const url = `/btl`;
    return axiosClients.post(url, data);
  },

  getAllBtl: (id) => {
    const url = `/btl?classId=${id}`;
    return axiosClients.get(url);
  },
  changeStatus: (data) => {
    const url = `/btl/changeStatus`;
    return axiosClients.post(url, data );
  },
};

export default BTLApi;

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
  getAllBtlSubject: (id) => {
    const url = `/btl/getAllBySubject?classId=${id}`;
    return axiosClients.get(url);
  },
  changeStatus: (data) => {
    const url = `/btl/changeStatus`;
    return axiosClients.post(url, data);
  },
  search: (data) => {
    const url = `/btl/searchBTL?name=${data?.name}&subjectId=${data?.classId}`;
    return axiosClients.get(url);
  },
};

export default BTLApi;

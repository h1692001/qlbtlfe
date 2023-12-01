import axiosClients from "../AxiosClient";
const ClassApi = {
  getAllClass: () => {
    const url = `/classV`;
    return axiosClients.get(url);
  },
  getAllMember: (id) => {
    const url = `/classV/getMembers?classId=${id}`;
    return axiosClients.get(url);
  },
  createClass: (data) => {
    const url = `/classV`;
    return axiosClients.post(url, data);
  },
  addMember: (data) => {
    const url = `/classV/addMember`;
    return axiosClients.post(url, data);
  },
};

export default ClassApi;

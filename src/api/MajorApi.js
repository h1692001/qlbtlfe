import axiosClients from "../AxiosClient";
const MajorApi = {
  getAllMajor: (data) => {
    const url = `/major`;   
    return axiosClients.get(url);
  },
  getAllFaculty: (data) => {
    const url = `/faculty`;   
    return axiosClients.get(url);
  },
};

export default MajorApi;

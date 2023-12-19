import axiosClients from "../AxiosClient";
const SubjectApi = {
  getAllSubject: (data) => {
    const url = `/subject/getAllByClassV?classId=${data}`;   
    return axiosClients.get(url);
  },
  getAllSubjectByUser: (data) => {
    const url = `/subject/getAllByUser?userId=${data}`;   
    return axiosClients.get(url);
  },
  addSubject: (data) => {
    const url = `/subject`;   
    return axiosClients.post(url,data);
  },
  addTeacher: (data) => {
    const url = `/subject`;   
    return axiosClients.put(url,data);
  },
};

export default SubjectApi;

import axiosClients from "../AxiosClient";
const UserApi = {
  getCurrentUser: (data) => {
    const url = `/user/getCurrentUser`;
    return axiosClients.get(url);
  },
  getAllStudents: (data) => {
    const url = `/user/getAllStudents`;
    return axiosClients.get(url);
  },
  getAllTeachers: (data) => {
    const url = `/user/getAllTeachers`;
    return axiosClients.get(url);
  },
  login:(data)=>{
    const url = `/login`;
    return axiosClients.post(url,data);
  },
  signupTeacher:(data)=>{
    const url=`/user/registerTeacher`
    return axiosClients.post(url,data)
  },
  signupStudent:(data)=>{
    const url=`/user/registerStudent`
    return axiosClients.post(url,data)
  }
};

export default UserApi;

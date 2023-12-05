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
  },
  forgotPassword:(data)=>{
    const url=`/user/forgotPassword`
    return axiosClients.post(url,data)
  },
  resetPassword:(data)=>{
    const url=`/user/resetPassword`
    return axiosClients.post(url,data)
  },
  checkForgotToken:(token)=>{
    const url=`/user/checkForgotToken?token=${token}`
    return axiosClients.get(url)
  },
  changePassword:(data)=>{
    const url=`/user/changePassword`
    return axiosClients.post(url,data)
  },
  enable: (id) => {
    const url = `/user/enableUser?userId=${id}`;
    return axiosClients.get(url);
  },
  disable: (id) => {
    const url = `/user/disableUser?userId=${id}`;
    return axiosClients.get(url);
  },
  updateStudent:(data)=>{
    const url=`/user/updateStudent`
    return axiosClients.put(url,data)
  },
  updateTeacher:(data)=>{
    const url=`/user/updateTeacher`
    return axiosClients.put(url,data)
  },
  
};

export default UserApi;

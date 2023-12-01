import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "./store/actions/authAction";
import UserApi from "./api/UserApi";
import SignIn from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Public from "./pages/Public/Public";
import ManageStudent from "./pages/Public/ManageStudent";
import ManageTeacher from "./pages/Public/ManageTeacher";
import ManageBTL from "./pages/Public/ManageBTL";
import ManageClass from "./pages/Public/ManageClass";
import ClassMembers from "./pages/Public/ClassMembers";
import MyBTLStore from "./pages/Public/MyBTLStore";

function App() {
  const { isLoggedIn, userCurrent } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebar, setIsSidebar] = useState(true);

  const checkAccess = async () => {
    try {
      const res = await UserApi.getCurrentUser();
      dispatch(getCurrentUser(res));
    } catch (err) {
      dispatch(logout());
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (isLoggedIn) {
      checkAccess();
    }
  }, [JSON.parse(localStorage.getItem("persist:auth")).isLoggedIn]);

  return (
    <>
      {!isLoggedIn && (
        <Routes>
          <Route path="/login" element={<SignIn></SignIn>}></Route>
          {/* <Route path="/signup" element={<SignUp></SignUp>}></Route> */}
        </Routes>
      )}
      {isLoggedIn && (
        <Routes>
         <Route path="/" element={<Public></Public>}>
          <Route path="manageStudent" element={<ManageStudent></ManageStudent>}></Route>
          <Route path="manageTeacher" element={<ManageTeacher></ManageTeacher>}></Route>
          <Route path="manageClass" element={<ManageClass></ManageClass>}></Route>
          <Route path="classMembers" element={<ClassMembers></ClassMembers>}></Route>
          <Route path="manageBTLStu" element={<MyBTLStore></MyBTLStore>}></Route>
          <Route path="" element={<ManageBTL></ManageBTL>}></Route>
         </Route>
        </Routes>
      )}
    </>
  );
}

export default App;

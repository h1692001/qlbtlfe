import actionTypes from "./actionTypes";
import reduxStore from "../../redux";
const { store, persistor } = reduxStore();

export const login = (data)=> {
  return {
    type:actionTypes.LOGIN_SUCCESS,
    action:data
  }
};

export const getCurrentUser=(data)=>{
  return {
    type:actionTypes.GET_CURRENT,
    action:data
  }
}

export const logout = (payload) => async (dispatch) => {
  dispatch({
    type: actionTypes.LOGOUT,
  });
  await persistor.flush();
};

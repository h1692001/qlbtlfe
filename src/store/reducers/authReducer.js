import actionTypes from "../actions/actionTypes";

const initState = {
  isLoggedIn: false,
  accessToken: null,
  msg: null,
  userCurrent: {},
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
    case actionTypes.REGISTER_SUCCESS:
      
      return {
        ...state,
        isLoggedIn: true,
        accessToken: action.action.accessToken,
        msg: action.action.message,
        userCurrent: {
          userId: action.action.userId,
          userName: action.action.username,
          email: action.action.email,
          avatar: action.action.avatar,
        },
      };
    case actionTypes.LOGIN_FAIL:
    case actionTypes.REGISTER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        accessToken: null,
        msg: action.message,
        userCurrent: {},
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        accessToken: null,
        msg: null,
        userCurrent: {},
      };
    case actionTypes.GET_CURRENT:
     
      return {
        ...state,
        userCurrent: {
          id:action.action.id,
          userId: action.action.userId,
          userName: action.action.fullname,
          email: action.action.email,
          avatar: action.action.avatar,
          role:action.action.role
        },
      };
    default:
      return state;
  }
};

export default authReducer;

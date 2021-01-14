import {
  LOGGED_IN,
  NOT_LOGGED_IN,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} from "../actions/types";

export const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  errors: [], // to store validation errors from the back end - STILL TO IMPLEMENT
};

export const AuthReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGGED_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: payload,
        loading: false,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: payload.data,
        loading: false,
      };
    case LOGOUT_SUCCESS:
    case NOT_LOGGED_IN:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    default:
      return state;
  }
};

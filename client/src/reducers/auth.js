import {
  LOGGED_IN,
  NOT_LOGGED_IN,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  PROFILE_UPDATE_SUCCESS,
  BECOME_SITTER,
  NOT_BECOME_SITTER,
} from "../actions/types";

export const initialState = {
  isAuthenticated: false,
  user: null,
  profile: null,
  loading: true,
  becomeSitter: false,
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
        profile: payload.profile,
        loading: false,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: payload.user,
        profile: payload.user.profile,
        loading: false,
      };
    case PROFILE_UPDATE_SUCCESS:
      return {
        ...state,
        user: payload.user,
        profile: payload.profile,
      };
    case LOGOUT_SUCCESS:
    case NOT_LOGGED_IN:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    case BECOME_SITTER:
      console.log("BECOME SITTER");
      return {
        ...state,
        becomeSitter: true,
      };
    case NOT_BECOME_SITTER:
      console.log("NOT BECOME SITTER");
      return {
        ...state,
        becomeSitter: false,
      };
    default:
      return state;
  }
};

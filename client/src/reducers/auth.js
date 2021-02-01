import {
  LOGGED_IN,
  NOT_LOGGED_IN,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  PROFILE_UPDATE_SUCCESS,
  BECOME_SITTER,
  NOT_BECOME_SITTER,
  GET_REQUEST_SUCCESS,
  REQUEST_UPDATED,
  PHOTO_CATEGORY_UPDATED,
  SET_ALERT,
  REMOVE_ALERT,
} from "../actions/types";

export const initialState = {
  isAuthenticated: false,
  user: null,
  profile: null,
  loading: true,
  becomeSitter: false,
  requests: null,
  errors: [],
  alerts: [],
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
      return {
        ...state,
        becomeSitter: true,
      };
    case NOT_BECOME_SITTER:
      return {
        ...state,
        becomeSitter: false,
      };
    case GET_REQUEST_SUCCESS:
      return {
        ...state,
        requests: payload,
      };
    case PHOTO_CATEGORY_UPDATED:
      return {
        ...state,
        profile: payload,
      };
    case REQUEST_UPDATED:
      return {
        ...state,
        requests: state.requests.map((request) => {
          if (request._id === payload.requestId) {
            return { ...request, ...payload.payload };
          } else {
            return request;
          }
        }),
      };
    case SET_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, payload],
      };
    case REMOVE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== payload),
      };
    default:
      return state;
  }
};

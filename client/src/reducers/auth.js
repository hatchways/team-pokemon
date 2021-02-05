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
  AVAILABILITY_UPDATE_SUCCESS,
  PAY_BOOKING_SUCCESS,
  PAY_BOOKING_FAILURE,
  CLEAR_ERRORS,
  REQUEST_ACCEPT_ERROR,
  UPDATE_NOTIFICATIONS,
  CREATE_BOOKING_FAILURE,
  
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
        errors: [],
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: payload.user,
        profile: payload.user.profile,
        loading: false,
        errors: [],
      };
    case PROFILE_UPDATE_SUCCESS:
      return {
        ...state,
        user: payload.user,
        profile: payload.profile,
        errors: [],
      };
    case LOGOUT_SUCCESS:
    case NOT_LOGGED_IN:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        errors: [],
      };
    case BECOME_SITTER:
      return {
        ...state,
        becomeSitter: true,
        errors: [],
      };
    case NOT_BECOME_SITTER:
      return {
        ...state,
        becomeSitter: false,
        errors: [],
      };
    case GET_REQUEST_SUCCESS:
      return {
        ...state,
        requests: payload,
        errors: [],
      };
    case UPDATE_NOTIFICATIONS:
    case PHOTO_CATEGORY_UPDATED:
      return {
        ...state,
        profile: payload,
        errors: [],
      };
    case REQUEST_UPDATED:
      return {
        ...state,
        requests: state.requests.map(request => {
          if (request._id === payload.requestId) {
            return { ...request, ...payload.payload };
          } else {
            return request;
          }
        }),
        errors: [],
      };
    case PAY_BOOKING_SUCCESS:
      return {
        ...state,
        requests: state.requests.map(request => {
          if (request._id === payload) {
            return { ...request, paid: true };
          } else {
            return request;
          }
        }),
        errors: [],
      };
    case PAY_BOOKING_FAILURE:
    case REQUEST_ACCEPT_ERROR:
    case CREATE_BOOKING_FAILURE:
      return {
        ...state,
        errors: [...state.errors, payload],
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        errors: [],
      };
    case AVAILABILITY_UPDATE_SUCCESS:
      return {
        ...state,
        profile: payload,
      };
    case SET_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, payload],
      };
    case REMOVE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== payload),
      };
    default:
      return state;
  }
};

import axios from "axios";
import {
  LOGGED_IN,
  NOT_LOGGED_IN,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} from "./types";

// Load User (If User Logged In)
export const getUser = async dispatch => {
  try {
    const res = await axios.get("/api/user/getuser");
    dispatch({ type: LOGGED_IN, payload: res.data });
  } catch (err) {
    dispatch({ type: NOT_LOGGED_IN });
    console.log(err.message);
  }
};

// Register User
export const register = async (dispatch, payload) => {
  try {
    const { firstName, lastName, email, password } = payload;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ firstName, lastName, email, password });
    const res = await axios.post("/api/user/register", body, config);
    if (res.data) {
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });
      return res.data;
    }
    // dispatch({ type: "REGISTER_ERROR", error: "a validation error ocurred" }); BACKEND ERRORS - Still to implement
    return;
  } catch (err) {
    //return error body to flash the message in Alert
    return err;
  }
};

// Login User
export const login = async (dispatch, payload) => {
  try {
    const { email, password } = payload;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ email, password });
    const res = await axios.post("/api/user/login", body, config);
    if (res.data) {
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      // dispatch({ type: "LOGIN_ERROR", error: "an error ocurred" }); BACKEND ERRORS - Still to implement
    }
  } catch (err) {
    //return error body to flash the message in Alert
    return err;
  }
};

// Logout User
export const logout = async dispatch => {
  try {
    await axios.get("/api/user/logout");
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (err) {
    console.log(err.message);
  }
};

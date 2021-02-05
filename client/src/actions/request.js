import axios from "axios";
import io from "socket.io-client";
import { setAlert } from "../actions/alert";
import {
  PAY_BOOKING_SUCCESS,
  PAY_BOOKING_FAILURE,
  CREATE_BOOKING_FAILURE,
} from "./types";

const socket = io();

// Create Request
export const createRequest = async (dispatch, payload, OwnerName) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.post("/api/request/", payload, config);
    setAlert(dispatch, "Request Sent!");
    socket.emit("requestSent", {
      sitterId: payload.sitterId,
      message: `${OwnerName} has sent you a request!`,
    });
  } catch (err) {
    const error = err.response.data.error.message;
    if (error) {
      dispatch({
        type: CREATE_BOOKING_FAILURE,
        payload: error,
      });
    }
    console.log(err.message);
  }
};

export const payRequest = async (dispatch, payload) => {
  try {
    const { id, amount } = payload;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ id, amount });
    await axios.post(`/api/request/${id}/pay`, body, config);
    dispatch({ type: PAY_BOOKING_SUCCESS, payload: id });
  } catch (err) {
    const error = err.response.data.error;
    if (error) {
      dispatch({
        type: PAY_BOOKING_FAILURE,
        payload: err.response.data.message,
      });
    }
    console.log(err.message);
  }
};

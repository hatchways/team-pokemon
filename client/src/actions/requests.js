import axios from "axios";
import io from "socket.io-client";
import {
  GET_REQUEST_SUCCESS,
  REQUEST_UPDATED,
  REQUEST_ACCEPT_ERROR,
} from "./types";

const socket = io();

// Get Requests
export const getRequests = async (dispatch) => {
  try {
    const res = await axios.get(`/api/request`);
    dispatch({ type: GET_REQUEST_SUCCESS, payload: res.data });
  } catch (err) {
    console.log(err.message);
  }
};

// Update Request with Accepted/Declined
export const updateRequest = async (
  dispatch,
  payload,
  requestId,
  ownerId,
  sitterName
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.put(`/api/request/${requestId}`, payload, config);
    dispatch({ type: REQUEST_UPDATED, payload: { requestId, payload } });
    if (payload.accepted) {
      socket.emit("requestAccepted", {
        ownerId,
        message: `${sitterName} has approved your request!`,
      });
    }
    if (payload.declined) {
      socket.emit("requestDeclined", {
        ownerId,
        message: `${sitterName} has declined your request!`,
      });
    }
  } catch (err) {
    dispatch({
      type: REQUEST_ACCEPT_ERROR,
      payload: err.response.data.message,
    });
    console.log(err.message);
  }
};

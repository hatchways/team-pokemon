import axios from "axios";
import { GET_REQUEST_SUCCESS, REQUEST_UPDATED } from "./types";

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
export const updateRequest = async (dispatch, payload, requestId) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.put(`/api/request/${requestId}`, payload, config);
    dispatch({ type: REQUEST_UPDATED, payload: { requestId, payload } });
  } catch (err) {
    console.log(err.message);
  }
};

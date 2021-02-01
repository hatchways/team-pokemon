import axios from "axios";
import { setAlert } from "../actions/alert";

// Update Profile
export const createRequest = async (dispatch, payload) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.post("/api/request/", payload, config);
    setAlert(dispatch, "Request Sent!");
  } catch (err) {
    console.log(err.message);
  }
};

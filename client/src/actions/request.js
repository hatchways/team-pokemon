import axios from "axios";
// import { REQUEST_SENT } from "./types";

// Update Profile
export const createRequest = async (payload) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.post("/api/request/", payload, config);
    // dispatch({ type: REQUEST_SENT });
  } catch (err) {
    console.log(err.message);
  }
};

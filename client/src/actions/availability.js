import axios from "axios";
import { AVAILABILITY_UPDATE_SUCCESS } from "./types";

export const addAvailability = async (dispatch, payload, profileId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(`/api/availability/${profileId}`, payload, config);
      dispatch({ type: AVAILABILITY_UPDATE_SUCCESS, payload: res.data });
    } catch (err) {
      console.log(err.message);
    }
  };
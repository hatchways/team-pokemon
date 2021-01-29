import axios from "axios";
import { AVAILABILITY_UPDATE_SUCCESS, PROFILE_UPDATE_SUCCESS } from "./types";

// Update Profile
export const updateProfile = async (dispatch, payload, profileId) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put(`/api/profile/${profileId}`, payload, config);
    dispatch({ type: PROFILE_UPDATE_SUCCESS, payload: res.data });
  } catch (err) {
    console.log(err.message);
  }
};
export const addAvailability = async (dispatch, payload, profileId) => {
  try{
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put(`/api/profile/availability/${profileId}`, payload, config);
    dispatch({ type: AVAILABILITY_UPDATE_SUCCESS, payload: res.data });
  }catch(err){
    console.log(err.message);
  }
}
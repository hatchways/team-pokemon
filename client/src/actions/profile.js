import axios from "axios";
import {
  PROFILE_UPDATE_SUCCESS,
  PHOTO_CATEGORY_UPDATED,
  AVAILABILITY_UPDATE_SUCCESS,
} from "./types";
import { setAlert } from "../actions/alert";

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

    if (payload.availability) {
      setAlert(dispatch, "Availability Removed");
    } else {
      setAlert(dispatch, "Profile Updated!");
    }
  } catch (err) {
    console.log(err.message);
  }
};

// Set Profile Photo
export const setPhotoCategory = async (dispatch, payload, profileId) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put(
      `/api/profile/upload/${profileId}`,
      payload,
      config
    );
    dispatch({ type: PHOTO_CATEGORY_UPDATED, payload: res.data });
  } catch (err) {
    console.error(err.message);
  }
};
//add availability
export const addAvailability = async (dispatch, payload, profileId) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put(
      `/api/profile/availability/${profileId}`,
      payload,
      config
    );
    dispatch({ type: AVAILABILITY_UPDATE_SUCCESS, payload: res.data });
    setAlert(dispatch, "Availability Added!");
  } catch (err) {
    console.log(err.message);
  }
};

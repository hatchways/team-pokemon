import axios from "axios";
import { UPDATE_NOTIFICATIONS } from "./types";

export const updateNotification = async (dispatch) => {
  try {
    const res = await axios.put(`/api/notifications`);
    dispatch({ type: UPDATE_NOTIFICATIONS, payload: res.data });
  } catch (err) {
    console.log(err.message);
  }
};

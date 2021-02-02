import { v4 as uuidv4 } from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";

export const setAlert = (dispatch, msg, timeout = 4000) => {
  const id = uuidv4();

  dispatch({ type: SET_ALERT, payload: { msg, id } });

  setTimeout(
    () =>
      dispatch({
        type: REMOVE_ALERT,
        payload: id,
      }),
    timeout
  );
};

export const removeAlert = (dispatch, id) => {
  dispatch({ type: REMOVE_ALERT, payload: id });
};

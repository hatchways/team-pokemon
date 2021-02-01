import React, { useState, useContext } from "react";
import { Snackbar, makeStyles } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { AuthDispatchContext, AuthStateContext } from "../context/AuthContext";
import { removeAlert } from "../actions/alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function SuccessAlert() {
  const { alerts } = useContext(AuthStateContext);
  const dispatch = useContext(AuthDispatchContext);

  const handleClose = (id) => {
    console.log(id);
    removeAlert(dispatch, id);
  };

  return (
    <>
      {alerts &&
        alerts.length > 0 &&
        alerts.map((alert) => (
          <Snackbar key={alert.id} open={alert}>
            <Alert onClose={() => handleClose(alert.id)} severity="success">
              {alert.msg}
            </Alert>
          </Snackbar>
        ))}
    </>
  );
}

export default SuccessAlert;

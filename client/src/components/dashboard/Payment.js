import React from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: { flexgrow: 1 },
}));

function Payment() {
  const classes = useStyles();
  return <Grid container>Payment</Grid>;
}

export default Payment;

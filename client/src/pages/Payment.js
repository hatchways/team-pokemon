import React from "react";
import { Box, Paper, makeStyles } from "@material-ui/core";
import SettingsMenu from "../components/dashboard/SettingsMenu";
import PaymentForm from "../components/dashboard/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51IAijpJ7csOfuHoFgBcxsKFgf6AeSeeEmRzrvKVKhIISSVSMkpaWhrfrqcSRAAAqNGBlK0fjR2j2NstZveJgXdSD00UkdnKqHS",
  { locale: "en" }
);

const useStyles = makeStyles(theme => ({
  centerPaper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  hideMenu: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  breakpoints: {
    [theme.breakpoints.down("sm")]: {},
    [theme.breakpoints.up("sm")]: {},
    [theme.breakpoints.up("md")]: {},
  },
}));

function Payment() {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexWrap="nowrap"
      style={{
        paddingTop: "90px",
        minHeight: "80vh",
        paddingBottom: "50px",
      }}
      bgcolor="grey"
    >
      <Box className={classes.hideMenu}>
        <SettingsMenu />
      </Box>
      <Box flexGrow={1}>
        <Paper
          square
          elevation={3}
          style={{ width: "75%", margin: "auto" }}
          className={classes.centerPaper + " " + classes.breakpoints}
        >
          <Elements stripe={stripePromise}>
            <PaymentForm />
          </Elements>
        </Paper>
      </Box>
    </Box>
  );
}

export default Payment;

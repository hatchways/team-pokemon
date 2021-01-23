import React from "react";
import { Box, Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "red",
    paddingTop: "100px",
    minHeight: "100vh",
  },
  nextBooking: {},
  bookingList: {},
  calendar: {},
}));

function Bookings() {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      {/* Requests List */}
      <Box
        style={{
          width: "400px",
          height: "50px",
          backgroundColor: "white",
          zIndex: 100000,
        }}
      >
        {/* Next Booking */}
        <Box></Box>
        <Box></Box>
      </Box>
      {/* Calendar */}
      <Box></Box>
    </Box>
  );
}

export default Bookings;

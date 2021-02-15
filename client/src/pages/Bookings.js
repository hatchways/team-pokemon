import React, { useContext, useEffect, useState } from "react";
import { Box, CircularProgress, makeStyles } from "@material-ui/core";
import moment from "moment";
import RequestList from "../components/bookings/RequestList";
import Calendar from "../components/bookings/Calendar";
import { getRequests } from "../actions/requests";
import { AuthDispatchContext, AuthStateContext } from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "#e6e6e6",
    paddingTop: "100px",
    minHeight: "100vh",
  },
  containerBreakpoints: {
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  },
  calendarDisplayBreakpoint: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  loadingSpinner: {
    position: "fixed",
    top: "50%",
    left: "50%",
  },
}));

function Bookings() {
  const classes = useStyles();

  const [sitterMode, setSitterMode] = useState(false);

  // Get dispatch method and state from auth context
  const dispatch = useContext(AuthDispatchContext);
  const { profile, requests, user } = useContext(AuthStateContext);

  // Make API call to all of the user's requests
  useEffect(() => {
    getRequests(dispatch);
  }, [dispatch]);

  // Today's date formatted to be used to determine if booking is current or past
  let today = new Date();
  const offset = today.getTimezoneOffset() / 60;
  today.setHours(today.getHours() - offset);
  const todayFormatted = today.toISOString();

  return (
    <>
      {!requests ? (
        <CircularProgress className={classes.loadingSpinner} />
      ) : (
        <Box className={classes.container + " " + classes.containerBreakpoints}>
          <RequestList
            profile={profile}
            requests={requests}
            user={user}
            sitterMode={sitterMode}
            setSitterMode={setSitterMode}
          />
          <Box className={classes.calendarDisplayBreakpoint}>
            <Calendar
              currentSitterBookings={requests
                .filter(
                  (request) =>
                    request.sitterId._id === user._id &&
                    request.end >= todayFormatted &&
                    request.accepted
                )
                .map((request) => moment(request.start).format("DD MM YY"))}
              currentOwnerBookings={requests
                .filter(
                  (request) =>
                    request.ownerId._id === user._id &&
                    request.end >= todayFormatted &&
                    request.accepted
                )
                .map((request) => moment(request.start).format("DD MM YY"))}
              sitterMode={sitterMode}
            />
          </Box>
        </Box>
      )}
    </>
  );
}

export default Bookings;

import React, { useContext } from "react";
import { Box, Switch, Typography, makeStyles } from "@material-ui/core";
import Request from "../../components/bookings/Request";
import {
  getNextSitterBooking,
  getNextOwnerBooking,
} from "../../utils/bookingsHelper";
import { AuthDispatchContext } from "../../context/AuthContext";
import { CLEAR_ERRORS } from "../../actions/types";

const useStyles = makeStyles((theme) => ({
  requestListContainer: {
    width: "500px",
  },
  requestListContainerBreakpoint: {
    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
  },
  sitterModeSwitch: {
    display: "flex",
    alignItems: "center",
    marginBottom: "30px",
  },
  nextBookingContainer: {
    marginBottom: "50px",
    padding: "25px",
    backgroundColor: "white",
    borderRadius: "5px",
  },
  overflow: {
    maxHeight: "50vh",
    backgroundColor: "white",
    borderRadius: "5px",
    overflow: "auto",
    padding: "15px",
    marginBottom: "20px",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "light-grey",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#a9a9a9",
      borderRadius: "10px",
    },
  },
  subheading: { fontWeight: "bold", letterSpacing: "1px" },
  subheadingMargin: { marginTop: "50px" },
  infotext: {
    fontWeight: "bold",
    letterSpacing: "1px",
    color: "#e6e6e6",
    textTransform: "uppercase",
    marginTop: "10px",
  },
}));

function RequestList({ requests, user, sitterMode, setSitterMode }) {
  const classes = useStyles();

  // Get dispatch method from context
  const dispatch = useContext(AuthDispatchContext);

  // Today's date formatted to be used to determine if booking is current or past
  let today = new Date();
  const offset = today.getTimezoneOffset() / 60;
  today.setHours(today.getHours() - offset);
  const todayFormatted = today.toISOString();

  // Map through each request to covert into <Request /> item. Filter into current/past sitter/owner catergories:

  const currentSitterRequests = requests
    .filter(
      (request) =>
        request.end >= todayFormatted && user._id === request.sitterId._id
    )
    .map((request) => (
      <Request
        key={request._id}
        request={request}
        sitterMode={sitterMode}
        modeTime="sitterCurrent"
      />
    ));

  const currentOwnerRequests = requests
    .filter(
      (request) =>
        request.end >= todayFormatted && user._id === request.ownerId._id
    )
    .map((request) => (
      <Request
        key={request._id}
        request={request}
        sitterMode={sitterMode}
        modeTime="ownerCurrent"
      />
    ));

  const pastSitterRequests = requests
    .filter(
      (request) =>
        request.end < todayFormatted && user._id === request.sitterId._id
    )
    .map((request) => (
      <Request
        key={request._id}
        request={request}
        sitterMode={sitterMode}
        modeTime="sitterPast"
      />
    ));

  const pastOwnerRequests = requests
    .filter(
      (request) =>
        request.end < todayFormatted && user._id === request.ownerId._id
    )
    .map((request) => (
      <Request
        key={request._id}
        request={request}
        sitterMode={sitterMode}
        modeTime="ownerPast"
      />
    ));

  const nextSitterBooking = getNextSitterBooking(
    requests,
    todayFormatted,
    user._id
  );

  const nextOwnerBooking = getNextOwnerBooking(
    requests,
    todayFormatted,
    user._id
  );

  return (
    <Box
      className={
        classes.requestListContainer +
        " " +
        classes.requestListContainerBreakpoint
      }
    >
      {/* Sitter Mode Switch - toggles between viewing bookings as a sitter and as an owner */}
      <Box className={classes.sitterModeSwitch}>
        <Switch
          color="primary"
          checked={sitterMode}
          onChange={() => {
            dispatch({ type: CLEAR_ERRORS });
            setSitterMode(!sitterMode);
          }}
        />
        <Typography className={classes.subheading}>DOG SITTER MODE</Typography>
      </Box>
      {/* Next Booking */}
      <Box className={classes.nextBookingContainer}>
        <Typography className={classes.subheading}>
          YOUR NEXT BOOKING:
        </Typography>
        {sitterMode && nextSitterBooking !== false ? (
          <Request
            request={nextSitterBooking}
            sitterMode={sitterMode}
            modeTime="sitterCurrent"
          />
        ) : (
          [
            !sitterMode && nextOwnerBooking !== false ? (
              <Request
                request={nextOwnerBooking}
                sitterMode={sitterMode}
                modeTime="ownerCurrent"
              />
            ) : (
              <Typography className={classes.infotext}>
                You have no upcoming bookings.
              </Typography>
            ),
          ]
        )}
      </Box>

      {/* Requests List */}
      <Box className={classes.overflow}>
        <Typography className={classes.subheading}>
          CURRENT BOOKINGS:
        </Typography>
        {/* Current Bookings */}
        <Box>
          {sitterMode && currentSitterRequests.length > 0
            ? currentSitterRequests
            : [
                !sitterMode && currentOwnerRequests.length > 0 ? (
                  currentOwnerRequests
                ) : (
                  <Typography className={classes.infotext}>
                    You have no current bookings.
                  </Typography>
                ),
              ]}
        </Box>
        {/* Past Bookings */}
        <Typography
          className={classes.subheading + " " + classes.subheadingMargin}
        >
          PAST BOOKINGS:
        </Typography>
        <Box>
          {sitterMode && pastSitterRequests.length > 0
            ? pastSitterRequests
            : [
                !sitterMode && pastOwnerRequests.length > 0 ? (
                  pastOwnerRequests
                ) : (
                  <Typography className={classes.infotext}>
                    You have no prior bookings.
                  </Typography>
                ),
              ]}
        </Box>
      </Box>
    </Box>
  );
}

export default RequestList;

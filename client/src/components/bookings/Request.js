import React from "react";
import { Avatar, Box, Card, makeStyles, Typography } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import moment from "moment";
import ProfileDefault from "../../img/profile-default.png";
import RequestStatus from "./RequestStatus";

const useStyles = makeStyles((theme) => ({
  requestSpacing: {
    marginTop: "10px",
    marginBottom: "10px",
    padding: "15px",
    border: "3px solid #e6e6e6",
  },
  requestSpacingBreakpoint: {
    [theme.breakpoints.down("xs")]: {
      padding: "5px",
    },
  },
  avatarSize: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  lightGreyColor: {
    color: "#e6e6e6",
    fontWeight: "bold",
    letterSpacing: "1.5px",
  },
  dateTimeHeading: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  dateTimeHeadingBreakpoint: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.9rem",
      fontWeight: "bold",
    },
  },
  dateTimeContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  requestBodyContainer: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "flex",
  },
  requestBodyContainerBreakpoint: {
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
    },
  },
  requestBodyGap: {
    marginRight: "15px",
  },
  requestBodyGapBreakpoint: {
    [theme.breakpoints.down("xs")]: {
      marginRight: "0",
    },
  },
  alignVert: {
    display: "flex",
    alignItems: "center",
  },
  alignVertBreakpoint: {
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  nameStyle: {
    fontSize: "20px",
  },
  nameStyleBreakpoint: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "16px",
    },
  },
}));

function Request({ request, modeTime, sitterMode }) {
  const classes = useStyles();
  const today = new Date();
  const offset = today.getTimezoneOffset() / 60;

  return (
    <>
      {request && (
        <Card
          variant="outlined"
          className={
            classes.requestSpacing + " " + classes.requestSpacingBreakpoint
          }
        >
          {/* Date and Settings */}
          <Box className={classes.dateTimeContainer}>
            <Typography
              className={
                classes.dateTimeHeading +
                " " +
                classes.dateTimeHeadingBreakpoint
              }
            >
              {`${moment(
                new Date(request.start).setHours(
                  new Date(request.start).getHours() + offset
                )
              ).format("DD MMM YYYY")}` ===
              `${moment(
                new Date(request.end).setHours(
                  new Date(request.end).getHours() + offset
                )
              ).format("DD MMM YYYY")}`
                ? `${moment(
                    new Date(request.start).setHours(
                      new Date(request.start).getHours() + offset
                    )
                  ).format("DD MMMM YYYY")}, ${moment(
                    new Date(request.start).setHours(
                      new Date(request.start).getHours() + offset
                    )
                  ).format("h:mm a")} - ${moment(
                    new Date(request.end).setHours(
                      new Date(request.end).getHours() + offset
                    )
                  ).format("h:mm a")}`
                : `${moment(
                    new Date(request.start).setHours(
                      new Date(request.start).getHours() + offset
                    )
                  ).format("DD MMM YYYY")}, ${moment(
                    new Date(request.start).setHours(
                      new Date(request.start).getHours() + offset
                    )
                  ).format("h:mm a")} - ${moment(
                    new Date(request.end).setHours(
                      new Date(request.end).getHours() + offset
                    )
                  ).format("DD MMM YYYY")}, ${moment(
                    new Date(request.end).setHours(
                      new Date(request.end).getHours() + offset
                    )
                  ).format("h:mm a")}`}
            </Typography>
            <SettingsIcon className={classes.lightGreyColor} />
          </Box>
          {/* Avatar, Name, Status */}
          <Box
            className={
              classes.requestBodyContainer +
              " " +
              classes.requestBodyContainerBreakpoint
            }
          >
            {sitterMode ? (
              <Box
                className={
                  classes.alignVert + " " + classes.alignVertBreakpoint
                }
              >
                <Avatar
                  className={
                    classes.avatarSize +
                    " " +
                    classes.requestBodyGap +
                    " " +
                    classes.requestBodyGapBreakpoint
                  }
                  alt="user"
                  src={
                    request.ownerId.profile.profilePicture
                      ? request.ownerId.profile.profilePicture
                      : ProfileDefault
                  }
                  size="large"
                />
                <Typography
                  className={
                    classes.nameStyle + " " + classes.nameStyleBreakpoint
                  }
                >{`${request.ownerId.profile.firstName} ${request.ownerId.profile.lastName}`}</Typography>
              </Box>
            ) : (
              <Box
                className={
                  classes.alignVert + " " + classes.alignVertBreakpoint
                }
              >
                <Avatar
                  className={
                    classes.avatarSize +
                    " " +
                    classes.requestBodyGap +
                    " " +
                    classes.requestBodyGapBreakpoint
                  }
                  alt="user"
                  src={
                    request.sitterId.profile.profilePicture
                      ? request.sitterId.profile.profilePicture
                      : ProfileDefault
                  }
                  size="large"
                />
                <Typography
                  className={classes.nameStyle}
                >{`${request.sitterId.profile.firstName} ${request.sitterId.profile.lastName}`}</Typography>
              </Box>
            )}
            <RequestStatus request={request} modeTime={modeTime} />
          </Box>
        </Card>
      )}
    </>
  );
}

export default Request;

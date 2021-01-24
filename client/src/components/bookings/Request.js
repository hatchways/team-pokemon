import React from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  makeStyles,
  Typography,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import moment from "moment";
import UserAvatarPic from "../../img/profilePhoto.jpg";

const useStyles = makeStyles((theme) => ({
  requestSpacing: {
    marginTop: "10px",
    marginBottom: "10px",
    padding: "15px",
    border: "3px solid #e6e6e6",
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
}));

function Request({ request }) {
  const classes = useStyles();
  console.log(request);
  const today = new Date();
  const offset = today.getTimezoneOffset() / 60;
  console.log("offset: ", offset);
  return (
    <>
      {request && (
        <Card variant="outlined" className={classes.requestSpacing}>
          {/* Date and Settings */}
          <Box style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
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
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                className={classes.avatarSize}
                style={{ marginRight: "15px" }}
                alt="user"
                src={UserAvatarPic}
                size="large"
              />
              <Typography style={{ fontSize: "20px" }}>Jane Doe</Typography>
            </Box>
            {/* <Box className={classes.lightGreyColor}>ACCEPTED</Box> */}
            <Box className={classes.lightGreyColor}>
              <ButtonGroup>
                <Button variant="contained" color="primary">
                  Accept
                </Button>
                <Button color="secondary">Decline</Button>
              </ButtonGroup>
            </Box>
          </Box>
        </Card>
      )}
    </>
  );
}

export default Request;

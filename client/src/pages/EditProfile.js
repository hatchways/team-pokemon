import React from "react";
import { Box, Hidden, Paper, makeStyles } from "@material-ui/core";
import EditProfileForm from "../components/dashboard/EditProfileForm";
import SettingsMenu from "../components/dashboard/SettingsMenu";

const useStyles = makeStyles(() => ({
  centerPaper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function EditProfile() {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      flexWrap="nowrap"
      style={{ paddingTop: "90px", minHeight: "100vh" }}
      bgcolor="grey"
    >
      <Hidden smDown>
        <Box>
          <SettingsMenu />
        </Box>
      </Hidden>
      <Hidden smDown>
        <Box flexGrow={1}>
          <Paper
            square
            elevation={3}
            className={classes.centerPaper}
            style={{
              paddingBottom: "50px",
              marginBottom: "25px",
              width: "690px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <EditProfileForm />
          </Paper>
        </Box>
      </Hidden>
      <Hidden xsDown mdUp>
        <Box flexGrow={1}>
          <Paper
            square
            elevation={3}
            className={classes.centerPaper}
            style={{
              paddingBottom: "50px",
              marginBottom: "25px",
              width: "580px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <EditProfileForm />
          </Paper>
        </Box>
      </Hidden>
      <Hidden smUp>
        <Box flexGrow={1} style={{}}>
          <Paper
            square
            elevation={3}
            className={classes.centerPaper}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <EditProfileForm />
          </Paper>
        </Box>
      </Hidden>
    </Box>
  );
}

export default EditProfile;

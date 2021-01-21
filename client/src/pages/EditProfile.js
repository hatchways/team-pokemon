import React from "react";
import { Box, Paper, makeStyles } from "@material-ui/core";
import EditProfileForm from "../components/dashboard/EditProfileForm";
import SettingsMenu from "../components/dashboard/SettingsMenu";

const useStyles = makeStyles((theme) => ({
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
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "100%",
    },
    [theme.breakpoints.up("sm")]: {
      paddingBottom: "50px",
      marginBottom: "25px",
      width: "580px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    [theme.breakpoints.up("md")]: {
      paddingBottom: "50px",
      marginBottom: "25px",
      width: "690px",
      marginLeft: "auto",
      marginRight: "auto",
    },
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
      <Box className={classes.hideMenu}>
        <SettingsMenu />
      </Box>
      <Box flexGrow={1}>
        <Paper
          square
          elevation={3}
          className={classes.centerPaper + " " + classes.breakpoints}
        >
          <EditProfileForm />
        </Paper>
      </Box>
    </Box>
  );
}

export default EditProfile;

import React from "react";
import { withRouter } from "react-router-dom";
import { Box, Paper, makeStyles } from "@material-ui/core";
import SettingsMenu from "../components/settings/SettingsMenu";
import ProfilePhoto from "../components/settings/ProfilePhoto";

const useStyles = makeStyles(theme => ({
  centerPaper: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  hideMenu: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  breakpoints: {
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "75%",
    },
  },
}));

function Photo() {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexWrap="nowrap"
      style={{ paddingTop: "90px", minHeight: "80vh" }}
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
          <ProfilePhoto />
        </Paper>
      </Box>
    </Box>
  );
}

export default withRouter(Photo);

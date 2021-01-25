import React from "react";
import { Box, Paper, makeStyles } from "@material-ui/core";
import SettingsMenu from "../components/dashboard/SettingsMenu";
import Calendar from "../components/dashboard/Calendar";

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
    [theme.breakpoints.down("sm")]: {},
    [theme.breakpoints.up("sm")]: {},
    [theme.breakpoints.up("md")]: {},
  },
}));

function Availability() {
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
          {/* Your Component Goes Here */}
          <Calendar />
        </Paper>
      </Box>
    </Box>
  );
}

export default Availability;

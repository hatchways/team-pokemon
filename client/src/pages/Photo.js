import React from "react";
import { withRouter } from "react-router-dom";
import { Box, Hidden, Paper, makeStyles } from "@material-ui/core";
import SettingsMenu from "../components/dashboard/SettingsMenu";
import ProfilePhoto from "../components/dashboard/ProfilePhoto";

const useStyles = makeStyles(() => ({
  centerPaper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function Photo() {
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
      <Hidden xsDown>
        <Box flexGrow={1}>
          <Paper
            square
            elevation={3}
            className={classes.centerPaper}
            style={{
              paddingBottom: "30px",
              width: "80%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <ProfilePhoto />
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
            <ProfilePhoto />
          </Paper>
        </Box>
      </Hidden>
    </Box>
  );
}

export default withRouter(Photo);

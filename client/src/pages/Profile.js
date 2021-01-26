import React from "react";
import { withRouter } from "react-router-dom";
import { Box, Paper, makeStyles } from "@material-ui/core";
import ProfileDetailCard from "../components/profile/ProfileDetailCard";
import ProfileRequestForm from "../components/profile/ProfileRequestForm";

const useStyles = makeStyles((theme) => ({
  // General
  container: {
    display: "flex",
    justifyContent: "space-around",
    paddingTop: "100px",
    minHeight: "100vh",
    backgroundColor: "#fafafa",
  },
  responsiveAlignment: {
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
  },
  // Profile Card
  profileBreakpoints: {
    [theme.breakpoints.down("md")]: {
      width: "90%",
      marginBottom: "30px",
      paddingBottom: "30px",
      overflow: "hidden",
    },
    [theme.breakpoints.up("md")]: {
      width: "50%",
      marginBottom: "100px",
      paddingBottom: "30px",
      overflow: "hidden",
    },
  },
  // Request Card
  centerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  requestBreakpoints: {
    [theme.breakpoints.down("sm")]: {
      width: "90%",

      marginBottom: "20px",
    },
    [theme.breakpoints.up("sm")]: {
      width: "350px",
      marginBottom: "20px",
    },
  },
}));

function Profile() {
  const classes = useStyles();

  return (
    <Box className={classes.container + " " + classes.responsiveAlignment}>
      <Paper className={classes.profileBreakpoints}>
        <ProfileDetailCard />
      </Paper>

      {/* Add check to only display the request card if the user whose profile you are visiting is a sitter */}
      <Paper
        className={classes.requestBreakpoints + " " + classes.centerContent}
      >
        <ProfileRequestForm />
      </Paper>
    </Box>
  );
}

export default withRouter(Profile);

import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Box, CircularProgress, Paper, makeStyles } from "@material-ui/core";
import ProfileDetailCard from "../components/profile/ProfileDetailCard";
import ProfileRequestForm from "../components/profile/ProfileRequestForm";
import { AuthStateContext } from "../context/AuthContext";

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
  // Loading
  loadingSpinner: {
    marginTop: "100px",
  },
}));

function Profile({ match }) {
  const classes = useStyles();

  // Get auth state
  const { user, profile } = useContext(AuthStateContext);

  const [profileDetails, setProfileDetails] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && user._id === match.params.user_id) {
        setProfileDetails(profile);
      } else {
        const result = await axios.get(`/api/profile/${match.params.user_id}`);
        setProfileDetails(result.data);
      }
    };

    fetchProfile();
  }, [match.params.user_id, user, profile]);

  return (
    <Box className={classes.container + " " + classes.responsiveAlignment}>
      {profileDetails ? (
        <>
          <Paper className={classes.profileBreakpoints}>
            <ProfileDetailCard profileDetails={profileDetails} />
          </Paper>
          {profileDetails.isSitter && user._id !== match.params.user_id && (
            <Paper
              className={
                classes.requestBreakpoints + " " + classes.centerContent
              }
            >
              <ProfileRequestForm />
            </Paper>
          )}
        </>
      ) : (
        <Box>
          <CircularProgress className={classes.loadingSpinner} />
        </Box>
      )}
    </Box>
  );
}

export default withRouter(Profile);

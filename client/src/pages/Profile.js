import React from "react";
import { withRouter } from "react-router-dom";
import { Box, Hidden, Paper, useMediaQuery } from "@material-ui/core";
import ProfileDetailCard from "../components/profile/ProfileDetailCard";
import ProfileRequestForm from "../components/profile/ProfileRequestForm";

function Profile() {
  const aboveMd = useMediaQuery("(min-width:960px)");
  return (
    <Box
      display="flex"
      flexDirection={aboveMd ? "row" : "column"}
      justifyContent="space-around"
      alignItems={aboveMd ? "flex-start" : "center"}
      style={{
        paddingTop: "100px",
        minHeight: "100vh",
        backgroundColor: "#fafafa",
      }}
    >
      <Hidden smDown>
        <Paper
          style={{
            width: "50%",
            marginBottom: "100px",
            paddingBottom: "30px",
            overflow: "hidden",
          }}
        >
          <ProfileDetailCard />
        </Paper>
      </Hidden>
      <Hidden mdUp>
        <Paper
          style={{
            width: "90%",
            marginBottom: "30px",
            paddingBottom: "30px",
            overflow: "hidden",
          }}
        >
          <ProfileDetailCard />
        </Paper>
      </Hidden>
      {/* Add check to only display the request card if the user whose profile you are visiting is a sitter */}
      <Hidden xsDown>
        <Paper
          style={{
            width: "350px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <ProfileRequestForm />
        </Paper>
      </Hidden>
      <Hidden smUp>
        <Paper
          style={{
            width: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <ProfileRequestForm />
        </Paper>
      </Hidden>
    </Box>
  );
}

export default withRouter(Profile);

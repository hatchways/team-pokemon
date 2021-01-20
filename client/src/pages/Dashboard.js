import React, { useState } from "react";
import { withRouter, BrowserRouter } from "react-router-dom";
import { Box, Hidden } from "@material-ui/core";
import EditProfile from "./EditProfile";
import Availability from "./Availability";
import ProfilePhoto from "./Photo";
import Payment from "./Payment";
import Security from "./Security";
import PrivateRoute from "../routes/ProtectedRoute";

function Dashboard({ match }) {
  console.log(`${match.path}/editprofile`);
  const [selectedSetting, setSelectedSetting] = useState("EditProfile");
  return (
    <Box
      display="flex"
      flexWrap="nowrap"
      style={{ paddingTop: "90px", minHeight: "100vh" }}
      bgcolor="grey"
    >
      <Hidden smDown>
        <Box></Box>
      </Hidden>
    </Box>
  );
}

export default withRouter(Dashboard);

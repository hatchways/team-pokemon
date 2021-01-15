import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import { Grid, Dialog, Hidden, Paper } from "@material-ui/core";
import Menu from "../components/dashboard/Menu";
import BackButton from "../components/dashboard/BackButton";
import { UserContext } from "../context/Context";
import OwnerProfile from "../components/dashboard/EditProfile/OwnerProfile";

function Profile() {
  const { dashboardDialogOpen } = useContext(UserContext);

  return (
    <Grid
      container
      style={{ paddingTop: "90px", height: "100vh", width: "80%" }}
    >
      <Hidden smDown>
        <Grid item lg={3} md={3} sm={4} xs={12}>
          <Menu />
        </Grid>
      </Hidden>
      <Hidden xsDown>
        <Grid
          item
          lg={9}
          md={9}
          sm={8}
          style={{
            width: "100%",
            padding: "15px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Paper
            square
            elevation={3}
            style={{
              paddingBottom: "75px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <OwnerProfile />
          </Paper>
        </Grid>
      </Hidden>
      <Hidden smUp>
        <Dialog open={dashboardDialogOpen} fullScreen>
          <BackButton />
          <Grid item lg={8} md={8} sm={8} xs={12} style={{ padding: "15px" }}>
            <Paper
              square
              elevation={3}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <OwnerProfile />
            </Paper>
          </Grid>
        </Dialog>
      </Hidden>
    </Grid>
  );
}

export default withRouter(Profile);

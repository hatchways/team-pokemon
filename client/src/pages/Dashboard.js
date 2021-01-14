import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import {
  Grid,
  Dialog,
  Hidden,
  Paper,
  Button,
  MenuList,
  MenuItem,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { makeStyles } from "@material-ui/core";
import EditProfile from "../components/dashboard/EditProfile";
import ProfilePhoto from "../components/dashboard/ProfilePhoto";
import Availability from "../components/dashboard/Availability";
import Payment from "../components/dashboard/Payment";
import Security from "../components/dashboard/Security";
import Settings from "../components/dashboard/Settings";

const useStyles = makeStyles(theme => ({
  root: { flexgrow: 1 },
  menuBox: {
    "&:focus": {
      outline: "none",
    },
  },
  menuItem: {
    fontSize: "20px",
    margin: "24px auto",
    width: "fit-content",
  },
  logout: {
    color: "red",
  },
  BackButton: {
    height: "60px",
    fontSize: "24px",
    borderRadius: "0",
  },
}));

function Dashboard() {
  const [open, setOpen] = useState(false);
  const [pageShown, setPageShown] = useState(1);
  const classes = useStyles();

  //rendering windows corresponding to menu options clicked
  function renderSwitch(pageShown) {
    switch (pageShown) {
      case 1:
        return <EditProfile />;
      case 2:
        return <ProfilePhoto />;
      case 3:
        return <Availability />;
      case 4:
        return <Payment />;
      case 5:
        return <Security />;
      case 6:
        return <Settings />;
      default:
        return <EditProfile />;
    }
  }

  //opening modal on mobile layout
  const handleMenuWindow = e => {
    setOpen(true);
    setPageShown(+e.target.id); //+ to quickly convert string into number
  };

  const handleLogout = () => {
    //API call to back-end
  };

  return (
    <Grid container style={{ paddingTop: "90px", height: "100vh" }}>
      <Grid item lg={3} md={3} sm={4} xs={12}>
        <MenuList className={classes.menuBox}>
          <MenuItem
            id="1"
            className={classes.menuItem}
            onClick={e => handleMenuWindow(e)}
          >
            Edit Profile
          </MenuItem>
          <MenuItem
            id="2"
            className={classes.menuItem}
            onClick={e => handleMenuWindow(e)}
          >
            Profile Photo
          </MenuItem>
          <MenuItem
            id="3"
            className={classes.menuItem}
            onClick={e => handleMenuWindow(e)}
          >
            Availability
          </MenuItem>
          <MenuItem
            id="4"
            className={classes.menuItem}
            onClick={e => handleMenuWindow(e)}
          >
            Payment
          </MenuItem>
          <MenuItem
            id="5"
            className={classes.menuItem}
            onClick={e => handleMenuWindow(e)}
          >
            Security
          </MenuItem>
          <MenuItem
            id="6"
            className={classes.menuItem}
            onClick={e => handleMenuWindow(e)}
          >
            Settings
          </MenuItem>
          <MenuItem
            className={classes.menuItem + " " + classes.logout}
            onClick={handleLogout}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Grid>
      <Hidden xsDown>
        <Grid item lg={9} md={9} sm={8} style={{ padding: "15px" }}>
          <Paper square elevation={3} style={{ width: "100%", height: "100%" }}>
            {renderSwitch(pageShown)}
          </Paper>
        </Grid>
      </Hidden>
      <Hidden smUp>
        <Dialog open={open} fullScreen>
          <Button
            startIcon={<ArrowBackIcon color="primary" />}
            className={classes.BackButton}
            color="primary"
            variant="outlined"
            onClick={() => setOpen(false)}
          >
            Back
          </Button>
          <Grid item lg={8} md={8} sm={8} xs={12} style={{ padding: "15px" }}>
            <Paper
              square
              elevation={3}
              style={{ width: "100%", height: "100%" }}
            >
              {renderSwitch(pageShown)}
            </Paper>
          </Grid>
        </Dialog>
      </Hidden>
    </Grid>
  );
}

export default withRouter(Dashboard);

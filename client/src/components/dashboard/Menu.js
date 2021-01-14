import React, { useContext } from "react";
import { MenuList, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { UserContext } from "../../context/Context";
import { Link } from "react-router-dom";

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
    color: "black",
  },
  logout: {
    color: "red",
  },
}));

function Menu() {
  const { setDashboardDialogOpen } = useContext(UserContext);

  const classes = useStyles();

  const handleLogout = () => {
    //API call to back-end to log user out
  };

  return (
    <MenuList className={classes.menuBox}>
      <Link to="/dashboard/profile" style={{ textDecoration: "none" }}>
        <MenuItem
          className={classes.menuItem}
          onClick={() => setDashboardDialogOpen(true)}
        >
          Edit Profile
        </MenuItem>
      </Link>
      <Link to="/dashboard/photo" style={{ textDecoration: "none" }}>
        <MenuItem
          className={classes.menuItem}
          onClick={() => setDashboardDialogOpen(true)}
        >
          Profile Photo
        </MenuItem>
      </Link>
      <Link to="/dashboard/availability" style={{ textDecoration: "none" }}>
        <MenuItem
          className={classes.menuItem}
          onClick={() => setDashboardDialogOpen(true)}
        >
          Availability
        </MenuItem>
      </Link>
      <Link to="/dashboard/payment" style={{ textDecoration: "none" }}>
        <MenuItem
          className={classes.menuItem}
          onClick={() => setDashboardDialogOpen(true)}
        >
          Payment
        </MenuItem>
      </Link>
      <Link to="/dashboard/security" style={{ textDecoration: "none" }}>
        <MenuItem
          className={classes.menuItem}
          onClick={() => setDashboardDialogOpen(true)}
        >
          Security
        </MenuItem>
      </Link>
      <Link to="/dashboard/settings" style={{ textDecoration: "none" }}>
        <MenuItem
          className={classes.menuItem}
          onClick={() => setDashboardDialogOpen(true)}
        >
          Settings
        </MenuItem>
      </Link>
      <MenuItem
        className={classes.menuItem + " " + classes.logout}
        onClick={handleLogout}
      >
        Logout
      </MenuItem>
    </MenuList>
  );
}

export default Menu;

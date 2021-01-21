import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MenuList, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { logout } from "../../actions/auth";
import { AuthDispatchContext } from "../../context/AuthContext";
import { UserContext } from "../../context/Context";

const useStyles = makeStyles((theme) => ({
  root: { flexgrow: 1 },
  menuBox: {
    "&:focus": {
      outline: "none",
    },
    padding: "0 50px",
  },
  menuItem: {
    fontSize: "20px",
    margin: "24px auto",
    width: "fit-content",
    color: "black",
  },
  linkStyle: {
    textDecoration: "none",
    "&:visited": {
      color: "inherit",
    },
  },
  logout: {
    color: "red",
  },
}));

function SettingsMenu({ setMenuOpen }) {
  const dispatch = useContext(AuthDispatchContext);
  const { setMobileMenuOpen } = useContext(UserContext);
  const classes = useStyles();

  return (
    <MenuList className={classes.menuBox}>
      <Link
        className={classes.linkStyle}
        to="/dashboard/editprofile"
        onClick={() => setMobileMenuOpen(false)}
      >
        <MenuItem className={classes.menuItem}>Edit Profile</MenuItem>
      </Link>
      <Link
        className={classes.linkStyle}
        to="/dashboard/photo"
        onClick={() => setMobileMenuOpen(false)}
      >
        <MenuItem className={classes.menuItem}>Profile Photo</MenuItem>
      </Link>
      <Link
        className={classes.linkStyle}
        to="/dashboard/availability"
        onClick={() => setMobileMenuOpen(false)}
      >
        <MenuItem className={classes.menuItem}>Availability</MenuItem>
      </Link>
      <Link
        className={classes.linkStyle}
        to="/dashboard/payment"
        onClick={() => setMobileMenuOpen(false)}
      >
        <MenuItem className={classes.menuItem}>Payment</MenuItem>
      </Link>
      <Link
        className={classes.linkStyle}
        to="/dashboard/security"
        onClick={() => setMobileMenuOpen(false)}
      >
        <MenuItem className={classes.menuItem}>Security</MenuItem>
      </Link>
      <Link
        className={classes.linkStyle}
        to="/dashboard/settings"
        onClick={() => setMobileMenuOpen(false)}
      >
        <MenuItem className={classes.menuItem}>Settings</MenuItem>
      </Link>
      <MenuItem
        className={classes.menuItem + " " + classes.logout}
        onClick={() => logout(dispatch)}
      >
        Logout
      </MenuItem>
    </MenuList>
  );
}

export default SettingsMenu;

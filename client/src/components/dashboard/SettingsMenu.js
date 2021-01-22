import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MenuList, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { logout } from "../../actions/auth";
import {
  AuthDispatchContext,
  AuthStateContext,
} from "../../context/AuthContext";
import { BECOME_SITTER } from "../../actions/types";
import { UserContext } from "../../context/Context";

const useStyles = makeStyles(theme => ({
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

function SettingsMenu() {
  const dispatch = useContext(AuthDispatchContext);
  const { isAuthenticated, profile } = useContext(AuthStateContext);
  const { setMobileMenuOpen } = useContext(UserContext);
  const classes = useStyles();

  const handleLogout = () => {
    logout(dispatch);
    setMobileMenuOpen(false);
  };
  //
  const handleBecomeSitter = () => {
    dispatch({ type: BECOME_SITTER });
    setMobileMenuOpen(false);
  };

  return (
    <>
      {isAuthenticated ? (
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
          {profile && !profile.isSitter ? (
            <Link
              className={classes.linkStyle}
              to="/dashboard/editprofile"
              onClick={handleBecomeSitter}
            >
              <MenuItem className={classes.menuItem}>Become a Sitter</MenuItem>
            </Link>
          ) : null}
          <MenuItem
            className={classes.menuItem + " " + classes.logout}
            onClick={handleLogout}
          >
            Logout
          </MenuItem>
        </MenuList>
      ) : (
        <MenuList className={classes.menuBox}>
          <Link
            className={classes.linkStyle}
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
          >
            <MenuItem className={classes.menuItem}>Login</MenuItem>
          </Link>
          <Link
            className={classes.linkStyle}
            to="/signup"
            onClick={() => setMobileMenuOpen(false)}
          >
            <MenuItem className={classes.menuItem}>Sign Up</MenuItem>
          </Link>
          <Link
            to="/signup"
            className={classes.linkStyle}
            onClick={handleBecomeSitter}
          >
            <MenuItem className={classes.menuItem}>Become a Sitter</MenuItem>
          </Link>
        </MenuList>
      )}
    </>
  );
}

export default SettingsMenu;

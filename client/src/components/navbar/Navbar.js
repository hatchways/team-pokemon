import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Hidden,
  Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MailIcon from "@material-ui/icons/Mail";
import { Link } from "react-router-dom";
import MobileNavbar from "./mobileNavbar";
import {
  AuthStateContext,
  AuthDispatchContext,
} from "../../context/AuthContext";
import { BECOME_SITTER } from "../../actions/types";
import { UserContext } from "../../context/Context";
import logo from "../../img/logo.png";
import defaultPicture from "../../img/profile-default.png";

const useStyles = makeStyles((theme) => ({
  root: { flexgrow: 1 },
  menuButton: { marginRight: "auto", color: "red" },
  toolbar: {
    backgroundColor: "transparent",
    boxShadow: "0 0 0",
  },
  toolbarAuth: {
    backgroundColor: "white",
    padding: "5px",
  },
  sitterLink: { color: "black", marginRight: "30px" },
  logo: {
    flexGrow: 1,
    marginRight: "auto",
    maxWidth: "150px",
  },
}));

function Navbar() {
  const { setMobileMenuOpen } = useContext(UserContext);

  const { isAuthenticated, profile } = useContext(AuthStateContext);
  const dispatch = useContext(AuthDispatchContext);
  const classes = useStyles();

  const handleBecomeSitter = () => {
    dispatch({ type: BECOME_SITTER });
  };

  return (
    <AppBar
      position="fixed"
      className={isAuthenticated ? classes.toolbarAuth : classes.toolbar}
    >
      <Toolbar variant="dense">
        <Hidden mdUp>
          <IconButton
            edge="start"
            className={classes.menuButton}
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <MobileNavbar />
        </Hidden>
        <Link to="/listings" style={{ marginRight: "auto" }}>
          <img src={logo} alt="logo" className={classes.logo} />
        </Link>
        {isAuthenticated ? (
          <>
            <Hidden smDown>
              {!profile.isSitter ? (
                <Link
                  to="/settings/editprofile"
                  style={{ textDecoration: "none", marginRight: "30px" }}
                >
                  <Button size="large" onClick={handleBecomeSitter}>
                    Become a Sitter
                  </Button>
                </Link>
              ) : null}

              <Link
                to="*"
                style={{ textDecoration: "none", marginRight: "30px" }}
              >
                <Button size="large">Messages</Button>
              </Link>
            </Hidden>
            <Hidden mdUp>
              <Link
                to="*"
                style={{ textDecoration: "none", marginRight: "30px" }}
              >
                <MailIcon color="primary" fontSize="large" />
              </Link>
            </Hidden>
            <Link to="/settings/editprofile" style={{ textDecoration: "none" }}>
              <Avatar
                alt="user"
                src={
                  profile && profile.profilePicture
                    ? profile.profilePicture
                    : defaultPicture
                }
              />
            </Link>
          </>
        ) : (
          <Hidden smDown>
            <Box mr={4} ml={4}>
              <Link to="/signup" style={{ textDecorationColor: "black" }}>
                <Button
                  size="large"
                  className={classes.sitterLink}
                  onClick={handleBecomeSitter}
                >
                  Become a Sitter
                </Button>
              </Link>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button color="primary" variant="outlined" size="large">
                  Login
                </Button>
              </Link>
            </Box>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <Button color="primary" variant="contained" size="large">
                Sign Up
              </Button>
            </Link>
          </Hidden>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

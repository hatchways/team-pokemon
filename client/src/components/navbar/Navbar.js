import React, { useState, useContext, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Hidden,
  Avatar,
  useMediaQuery,
  Badge,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MailIcon from "@material-ui/icons/Mail";
import EventNoteIcon from "@material-ui/icons/EventNote";
import { Link } from "react-router-dom";
import MobileNavbar from "./mobileNavbar";
import Notifications from "../notifications/Notifications";
import {
  AuthStateContext,
  AuthDispatchContext,
} from "../../context/AuthContext";
import { BECOME_SITTER } from "../../actions/types";
import { UserContext } from "../../context/Context";
import logo from "../../img/logo.png";
import logoMobile from "../../img/logo_mobile.png";
import defaultPicture from "../../img/profile-default.png";

const useStyles = makeStyles(theme => ({
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
  avatarLink: {
    marginRight: "auto",
  },
  authLinkStyling: {
    textDecoration: "none",
    marginRight: "10px",
    marginLeft: "10px",
  },
  signupLinkStyling: {
    textDecorationColor: "black",
  },
  removeTextDecoration: {
    textDecoration: "none",
    marginLeft: "15px",
  },
  icons: {
    color: "black",
  },
  notificationDot: {
    marginBottom: "15px",
    marginLeft: "-5px",
  },
  notificationDotMobile: {
    marginTop: "-50px",
    marginLeft: "8px",
  },
}));

function Navbar() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { setMobileMenuOpen, socket, isChatting, setIsChatting } = useContext(
    UserContext
  );
  const [showBadge, setShowBadge] = useState(false);
  const { isAuthenticated, profile, user } = useContext(AuthStateContext);
  const dispatch = useContext(AuthDispatchContext);
  const classes = useStyles();

  useEffect(() => {
    if (user) {
      const data = {
        userId: user._id,
      };
      if (socket) {
        socket && socket.emit("join", { data }, () => {});
      }
    }
  }, [user]);

  useEffect(() => {
    socket &&
      socket.on("newMessage", () => {
        if (!isChatting) {
          setShowBadge(true);
        }
        return;
      });
  }, [socket]);

  const handleBecomeSitter = () => {
    dispatch({ type: BECOME_SITTER });
  };

  return (
    <>
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
          <Link to="/listings" className={classes.avatarLink}>
            {isMobile ? (
              <img src={logoMobile} alt="logo" className={classes.logo} />
            ) : (
              <img src={logo} alt="logo" className={classes.logo} />
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <Hidden smDown>
                {!profile.isSitter ? (
                  <Link
                    to="/settings/editprofile"
                    className={classes.authLinkStyling}
                  >
                    <Button size="large" onClick={handleBecomeSitter}>
                      Become a Sitter
                    </Button>
                  </Link>
                ) : null}
                <Link to="/bookings" className={classes.authLinkStyling}>
                  <Button size="large">Bookings</Button>
                </Link>
                <Notifications />
                <Link to="/chat" className={classes.authLinkStyling}>
                  <Button
                    size="large"
                    onClick={() => {
                      setShowBadge(false);
                      setIsChatting(true);
                    }}
                  >
                    Messages
                  </Button>
                  {showBadge ? (
                    <Badge
                      color="primary"
                      variant="dot"
                      className={classes.notificationDot}
                    ></Badge>
                  ) : null}
                </Link>
              </Hidden>
              <Hidden mdUp>
                <Link to="/bookings" className={classes.authLinkStyling}>
                  <EventNoteIcon fontSize="large" className={classes.icons} />
                </Link>
                <Notifications />
                <Link to="/chat" className={classes.authLinkStyling}>
                  <MailIcon
                    fontSize="large"
                    className={classes.icons}
                    onClick={() => {
                      setShowBadge(false);
                      setIsChatting(true);
                    }}
                  />{" "}
                  {showBadge ? (
                    <Badge
                      color="primary"
                      variant="dot"
                      className={classes.notificationDotMobile}
                    ></Badge>
                  ) : null}
                </Link>
              </Hidden>
              <Link
                to="/settings/editprofile"
                className={classes.removeTextDecoration}
              >
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
                <Link to="/signup" className={classes.signupLinkStyling}>
                  <Button
                    size="large"
                    className={classes.sitterLink}
                    onClick={handleBecomeSitter}
                  >
                    Become a Sitter
                  </Button>
                </Link>
                <Link to="/login" className={classes.removeTextDecoration}>
                  <Button color="primary" variant="outlined" size="large">
                    Login
                  </Button>
                </Link>
              </Box>
              <Link to="/signup" className={classes.removeTextDecoration}>
                <Button color="primary" variant="contained" size="large">
                  Sign Up
                </Button>
              </Link>
            </Hidden>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;

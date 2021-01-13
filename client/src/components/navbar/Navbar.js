import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Hidden,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";
import MobileNavbar from "./mobileNavbar";
import { UserContext } from "../../context/Context";
import logo from "../../img/logo.png";

const useStyles = makeStyles(theme => ({
  root: { flexgrow: 1 },
  menuButton: { marginRight: theme.spacing(4), color: "red" },
  toolbar: {
    backgroundColor: "transparent",
    boxShadow: "0 0 0",
  },
  toolbarAuth: {
    backgroundColor: "white",
  },
  sitterLink: { color: "black", marginRight: "30px" },
  logo: {
    flexGrow: 1,
    marginRight: "auto",
    maxWidth: "150px",
  },
}));

function Navbar() {
  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    isAuthenticated,
    setIsAuthenticated,
  } = useContext(UserContext);
  const classes = useStyles();

  //pass signed as context into navbar and swap styles together with representing other buttons, like profile instead of log in
  //!user?toolbarAuth:toolbar

  //context variable mobileMenuOpen, setMobileMenuOpen
  //set true on click  here and false on click "x" at mobileNavbar component
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log(mobileMenuOpen);
  }, []);

  const handleOpenMenu = () => {
    setMobileMenuOpen(true);
    //setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
            onClick={handleOpenMenu}
          >
            <MenuIcon />
          </IconButton>
          <MobileNavbar open={mobileMenuOpen} />
        </Hidden>
        <img src={logo} alt="logo" className={classes.logo} />
        <Hidden smDown>
          <Box mr={4} ml={4}>
            <Link to="*">
              <Button
                color="secondary"
                size="large"
                className={classes.sitterLink}
              >
                Become a Sitter
              </Button>
            </Link>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button color="secondary" variant="outlined" size="large">
                Login
              </Button>
            </Link>
          </Box>
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <Button color="secondary" variant="contained" size="large">
              Sign Up
            </Button>
          </Link>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

import React, { useContext } from "react";
import {
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
import { AuthStateContext } from "../../context/AuthContext";
import { UserContext } from "../../context/Context";
import logo from "../../img/logo.png";

const useStyles = makeStyles((theme) => ({
  root: { flexgrow: 1 },
  menuButton: { marginRight: "auto", color: "red" },
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
  const { setMobileMenuOpen } = useContext(UserContext);

  const { isAuthenticated } = useContext(AuthStateContext);
  const classes = useStyles();

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
            style={{ marginRight: "auto" }}
          >
            <MenuIcon />
          </IconButton>
          <MobileNavbar />
        </Hidden>
        <img src={logo} alt="logo" className={classes.logo} />
        <Hidden smDown>
          <Box mr={4} ml={4}>
            <Link to="*" style={{ textDecorationColor: "black" }}>
              <Button size="large" className={classes.sitterLink}>
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
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

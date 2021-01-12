import React, { Component } from "react";

import {
  Typography,
  Grid,
  Container,
  Hidden,
  Paper,
  Box,
} from "@material-ui/core";
//import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core";
import { Route, Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import dogsPicture from "../img/dogs-main.jpg";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  sideImage: {
    height: "100vh",
    position: "relative",
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
}));

function Login() {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      spacing={0}
      justify="center"
    >
      <Grid
        item
        lg={6}
        md={6}
        sm={12}
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        <LoginForm />
      </Grid>
      <Hidden smDown>
        <Grid
          item
          lg={6}
          md={6}
          justify="center"
          alignItems="center"
          style={{ backgroundColor: "blue", height: "100vh" }}
        >
          <Paper
            className={classes.sideImage}
            square
            style={{
              backgroundImage: `url(${dogsPicture})`,
            }}
          ></Paper>
        </Grid>
      </Hidden>
    </Grid>
  );
}

export default Login;

import React from "react";
import { Grid, Hidden, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import LoginForm from "../components/LoginForm";
import dogsPicture from "../img/dogs-main.jpg";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  gridContainer: { height: "100vh" },
  sideImage: {
    height: "100%",
    margin: "0",
    position: "relative",
    color: theme.palette.common.white,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundImage: `url(${dogsPicture})`,
  },
  loginFormOverflow: {
    overflowY: "auto",
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
      className={classes.gridContainer}
    >
      <Grid item lg={6} md={6} sm={12} className={classes.loginFormOverflow}>
        <form>
          <LoginForm />
        </form>
      </Grid>
      <Hidden smDown>
        <Grid item lg={6} md={6} className={classes.gridContainer}>
          <Paper className={classes.sideImage} square></Paper>
        </Grid>
      </Hidden>
    </Grid>
  );
}

export default Login;

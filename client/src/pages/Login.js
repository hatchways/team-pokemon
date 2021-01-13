import React from "react";
import { Grid, Hidden, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import LoginForm from "../components/LoginForm";
import dogsPicture from "../img/dogs-main.jpg";

//import Navbar from "../components/navbar/Navbar";

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
      style={{ height: "100vh" }}
    >
      <Grid item lg={6} md={6} sm={12} style={{ overflowY: "auto" }}>
        <form>
          <LoginForm />
        </form>
      </Grid>
      <Hidden smDown>
        <Grid item lg={6} md={6} style={{ height: "100vh" }}>
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

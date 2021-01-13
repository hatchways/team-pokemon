import React from "react";
import { Grid, Hidden, Paper } from "@material-ui/core";
//import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core";
//import { Route, Link } from "react-router-dom";
import SignupForm from "../components/SignupForm";
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

function Signup() {
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
        <form>
          <SignupForm />
        </form>
      </Grid>
      <Hidden smDown>
        <Grid
          item
          lg={6}
          md={6}
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

export default Signup;

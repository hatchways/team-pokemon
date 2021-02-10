import React from "react";
import { Grid, Hidden, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import SignupForm from "../components/SignupForm";
import dogsPicture from "../img/dogs-main.jpg";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  gridContainer: {
    height: "100vh",
  },
  sideImage: {
    height: "100vh",
    position: "relative",
    color: theme.palette.common.white,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundImage: `url(${dogsPicture})`,
  },
  signUpFormOverflow: {
    overflowY: "auto",
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
      className={classes.gridContainer}
    >
      <Grid item lg={6} md={6} sm={12} className={classes.signUpFormOverflow}>
        <form>
          <SignupForm />
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

export default Signup;

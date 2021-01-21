import React from "react";
import { withRouter } from "react-router-dom";
import { Grid, Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import dog404 from "../img/dog-404.png";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  image: {
    height: "60vh",
    width: "90vw",
    position: "relative",
    backgroundImage: `url(${dog404})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: "transparent",
  },
  parentBox: {
    paddingTop: "90px",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#fafafa",
    marginRight: "0",
  },
  textBox: {
    margin: "10px",
    marginBottom: "auto",
    textAlign: "center",
  },
  headerBox: {
    marginTop: "auto",
  },
  headerText: {
    margin: "10px",
  },
  profileLink: {
    color: "red",
    textDecoration: "none",
  },
}));

function PageNotFound() {
  const classes = useStyles();
  return (
    <Grid
      container
      className={classes.parentBox}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item className={classes.headerBox}>
        <Typography variant="h1">Woofs!</Typography>
      </Grid>
      <Grid item className={classes.textBox}>
        <Typography variant="h4">
          Seems like such page doesn't exist
          <br />
          <Link to="/dashboard/profile" className={classes.profileLink}>
            Back to profile
          </Link>
        </Typography>
      </Grid>
      <Grid item>
        <Paper
          square
          elevation={0}
          className={classes.image}
        ></Paper>
      </Grid>
    </Grid>
  );
}

export default withRouter(PageNotFound);

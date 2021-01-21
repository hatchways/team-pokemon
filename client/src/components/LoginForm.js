import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { Typography, Grid, TextField, Button } from "@material-ui/core";
//import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import AlertMessage from "./Alert";

import { login } from "../actions/auth";
import { AuthDispatchContext, AuthStateContext } from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  elements: {
    marginBottom: theme.spacing(2),
  },
  text: {
    width: "300px",
    maxWidth: "100%",
  },
}));

function LoginForm() {
  //save user's input into state
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  //state for alert message to pass into Alert.js component if form validation fails
  const [alert, setAlert] = useState({ error: false, message: "" });

  // get dispatch method and state from auth context
  const dispatch = useContext(AuthDispatchContext);
  const { isAuthenticated } = useContext(AuthStateContext);

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
    setAlert({ error: false, message: "" });
  };
  //submitting user's credentials
  const handleSubmit = (e) => {
    e.preventDefault();
    //validating user input fields before submit
    if (credentials.email.length < 1 || !credentials.email) {
      setAlert({ error: true, message: "Please fill up email field" });
      return;
    } else if (credentials.email.match(/\S+@\S+\.\S+/) == null) {
      setAlert({ error: true, message: "Invalid email address" });
      return;
    } else if (credentials.password.length < 1 || !credentials.password) {
      setAlert({
        error: true,
        message: "Please fill up password field",
      });
      return;
    }

    // Login action makes API request and handles all the necessary state changes
    login(dispatch, credentials);
  };

  //call classes for Material-UI components
  const classes = useStyles();

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard/editprofile" />;
  }

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      direction="column"
      spacing={0}
      style={{ paddingTop: "25px" }}
    >
      <Grid item className={classes.elements}>
        <Typography
          variant="h4"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          Login
        </Typography>
      </Grid>
      <Grid item className={classes.elements}>
        <TextField
          className={classes.text}
          onChange={handleInputChange}
          variant="outlined"
          type="email"
          id="email"
          placeholder="Your Email"
          label="Email"
          required
        />
      </Grid>
      <Grid item className={classes.elements}>
        <TextField
          className={classes.text}
          onChange={handleInputChange}
          variant="outlined"
          type="password"
          id="password"
          minLength="6"
          placeholder="Your Password"
          label="Password"
          autoComplete="on"
          required
        />
      </Grid>
      <Grid item className={classes.elements}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          color="primary"
          onClick={handleSubmit}
        >
          Login
        </Button>
        <AlertMessage alert={alert} />
      </Grid>
      <Grid item className={classes.elements}>
        <Typography variant="subtitle1">
          Don't have an account yet?{" "}
          <Link to="/signup" style={{ color: "red" }}>
            Sign Up
          </Link>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default LoginForm;

import React, { useState, useContext } from "react";
import { Redirect, useLocation } from "react-router-dom";
import {
  CircularProgress,
  Typography,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";
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

  // state for showing spinner on login button when user clicks login
  const [loggingIn, setLoggingIn] = useState(false);

  // get dispatch method and state from auth context
  const dispatch = useContext(AuthDispatchContext);
  const { isAuthenticated } = useContext(AuthStateContext);

  //redirect to where user comes from after authentication
  const { state } = useLocation();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
    setAlert({ error: false, message: "" });
  };
  //submitting user's credentials
  const handleSubmit = (e) => {
    setLoggingIn(true);
    e.preventDefault();
    //validating user input fields before submit
    if (credentials.email.length < 1 || !credentials.email) {
      setAlert({ error: true, message: "Please fill up email field" });
      setLoggingIn(false);
      return;
    } else if (credentials.email.match(/\S+@\S+\.\S+/) == null) {
      setAlert({ error: true, message: "Invalid email address" });
      setLoggingIn(false);
      return;
    } else if (credentials.password.length < 1 || !credentials.password) {
      setAlert({
        error: true,
        message: "Please fill up password field",
      });
      setLoggingIn(false);
      return;
    }

    // Login action makes API request and handles all the necessary state changes
    const res = async () => {
      let resp = await login(dispatch, credentials);
      if (resp !== undefined && resp.response.data.error.message) {
        setLoggingIn(false);
        setAlert({
          error: true,
          message: resp.response.data.error.message,
        });
      }
    };
    res();
  };

  //call classes for Material-UI components
  const classes = useStyles();

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to={state?.from || "/"} />;
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
          {loggingIn ? <CircularProgress color="white" size={20} /> : `LOGIN`}
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

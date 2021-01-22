import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { Typography, Grid, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import AlertMessage from "./Alert";
import { register } from "../actions/auth";
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

function SignupForm() {
  //save user's input into state
  const [credentials, setCredentials] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  //state for alert message to pass into Alert.js component if form validation fails
  const [alert, setAlert] = useState({ error: false, message: "" });

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
    setAlert({ error: false, message: "" });
  };

  // get the dispatch method from auth context
  const dispatch = useContext(AuthDispatchContext);

  // get authentication state from auth context
  const { isAuthenticated } = useContext(AuthStateContext);

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
    } else if (credentials.firstName.length < 1 || !credentials.firstName) {
      setAlert({ error: true, message: "Please fill up First Name field" });
      return;
    } else if (credentials.lastName.length < 1 || !credentials.lastName) {
      setAlert({ error: true, message: "Please fill up Last Name field" });
      return;
    } else if (
      credentials.firstName.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/) ==
        null ||
      credentials.lastName.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/) == null
    ) {
      setAlert({
        error: true,
        message:
          "Name should start with a letter. Only letters, a space and/or hyphen are allowed",
      });
      return;
    } else if (credentials.password.length < 6) {
      setAlert({
        error: true,
        message: "Password has to be at least 6 characters",
      });
      return;
    }

    // Register action makes API request and handles all the necessary state changes

    const res = async () => {
      let resp = await register(dispatch, credentials);
      if (resp !== undefined && resp.response) {
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
          style={{ marginTop: "20px", marginBottom: "5px" }}
        >
          Sign Up
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
          id="firstName"
          label="First Name"
          placeholder="Your First Name"
          required
        />
      </Grid>
      <Grid item className={classes.elements}>
        <TextField
          className={classes.text}
          onChange={handleInputChange}
          variant="outlined"
          id="lastName"
          placeholder="Your Last Name"
          label="Last Name"
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
          placeholder="Create a password (at least 6 characters)"
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
          Sign Up
        </Button>
        <AlertMessage alert={alert} />
      </Grid>
      <Grid item className={classes.elements}>
        <Typography variant="subtitle1">
          Already a member?{" "}
          <Link to="/login" style={{ color: "red" }}>
            Login
          </Link>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default SignupForm;

import React, { useState } from "react";
import { Typography, Grid, TextField, Button } from "@material-ui/core";
//import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import AlertMessage from "./Alert";

const useStyles = makeStyles(theme => ({
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

  const handleInputChange = e => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
    setAlert({ error: false, message: "" });
  };
  //submitting user's credentials
  const handleSubmit = e => {
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

    //validation passed
    console.log(credentials);
  };
  //call classes for Material-UI components
  const classes = useStyles();
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      direction="column"
      spacing={0}
    >
      <Grid item className={classes.elements}>
        <Typography variant="h4" style={{ marginTop: "20px" }}>
          Login
        </Typography>
      </Grid>
      <Grid item className={classes.elements}>
        <Typography>Email</Typography>
        <TextField
          className={classes.text}
          onChange={handleInputChange}
          variant="outlined"
          type="email"
          id="email"
          placeholder="Your Email"
          autoFocus
          required
        />
      </Grid>
      <Grid item className={classes.elements}>
        <Typography className={classes.labels}>Password</Typography>
        <TextField
          className={classes.text}
          onChange={handleInputChange}
          variant="outlined"
          type="password"
          id="password"
          minLength="6"
          placeholder="Your Password"
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

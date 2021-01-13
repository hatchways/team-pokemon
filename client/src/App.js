import React, { useState } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import { theme } from "./themes/theme";
//import LandingPage from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile"; //temporary name

import "./App.css";

function App() {
  //loggedIn -> should come form context

  //const [loggedIn, setLoggedIn] = useState(false);
  const loggedIn = false; //for now, use variable instead of state to avoid error on console
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Route path="/">
          {loggedIn ? <Profile /> : <Redirect to="/signup" />}
        </Route>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;

import React, { useEffect, useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import { AuthStateContext, AuthDispatchContext } from "./context/AuthContext";
import { getUser } from "./actions/auth";
import { initialState, AuthReducer } from "./reducers/auth";

import PrivateRoute from "./routing/PrivateRoute";

import { theme } from "./themes/theme";
//import LandingPage from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile"; // temporary name
import TestingRoute from "./pages/TestingRoute";

import "./App.css";

function App() {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // Check if user is logged in when App mounts.
  useEffect(() => {
    getUser(dispatch);
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthStateContext.Provider value={state}>
          <AuthDispatchContext.Provider value={dispatch}>
            <Route exact path="/">
              {state.isAuthenticated ? (
                <Redirect to="/profile" />
              ) : (
                <Redirect to="/signup" />
              )}
            </Route>
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute exact path="/testingroute" component={TestingRoute} />
          </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;

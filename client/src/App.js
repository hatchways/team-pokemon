import React, { useEffect, useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import { AuthStateContext, AuthDispatchContext } from "./context/AuthContext";
import { getUser } from "./actions/auth";
import { initialState, AuthReducer } from "./reducers/auth";

import PrivateRoute from "./routing/PrivateRoute";

import { theme } from "./themes/theme";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import TestingRoute from "./pages/TestingRoute";
import Navbar from "./components/navbar/Navbar";
import Profile from "./pages/Profile";
import Photo from "./pages/Photo";
import Availability from "./pages/Availability";
import Payment from "./pages/Payment";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import ProtectedRoute from "./routes/ProtectedRoute";


//import "./App.css";

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
            <Navbar />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/" exact component={Profile} />
            <PrivateRoute path="/dashboard/profile" component={Profile} />
            <PrivateRoute path="/dashboard/photo" component={Photo} />
            <PrivateRoute
              path="/dashboard/availability"
              component={Availability}
            />
            <PrivateRoute path="/dashboard/payment" component={Payment} />
            <PrivateRoute path="/dashboard/security" component={Security} />
            <PrivateRoute path="/dashboard/settings" component={Settings} />
          </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;

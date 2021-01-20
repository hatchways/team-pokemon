import React, { useEffect, useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";
import { AuthStateContext, AuthDispatchContext } from "./context/AuthContext";
import { getUser } from "./actions/auth";
import { initialState, AuthReducer } from "./reducers/auth";
import PrivateRoute from "./routing/PrivateRoute";
import { theme } from "./themes/theme";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/navbar/Navbar";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Photo from "./pages/Photo";
import Availability from "./pages/Availability";
import Payment from "./pages/Payment";
import Security from "./pages/Security";
import Settings from "./pages/Settings";

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
            <PrivateRoute exact path="/" component={Profile} />
            <PrivateRoute
              exact
              path="/dashboard/editprofile"
              component={EditProfile}
            />
            <PrivateRoute exact path="/dashboard/photo" component={Photo} />
            <PrivateRoute
              exact
              path="/dashboard/availability"
              component={Availability}
            />
            <PrivateRoute exact path="/dashboard/payment" component={Payment} />
            <PrivateRoute
              exact
              path="/dashboard/security"
              component={Security}
            />
            <PrivateRoute
              exact
              path="/dashboard/settings"
              component={Settings}
            />
          </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;

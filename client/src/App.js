import React, { useEffect, useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AuthStateContext, AuthDispatchContext } from "./context/AuthContext";
import { getUser } from "./actions/auth";
import { initialState, AuthReducer } from "./reducers/auth";
import PrivateRoute from "./routing/PrivateRoute";
import { theme } from "./themes/theme";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/navbar/Navbar";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import EditProfile from "./pages/EditProfile";
import Photo from "./pages/Photo";
import Availability from "./pages/Availability";
import Payment from "./pages/Payment";
import Security from "./pages/Security";
import Settings from "./pages/Account";
import PageNotFound from "./pages/PageNotFound";
import ProfileListings from "./pages/ProfileListings";
import SuccessAlert from "./components/SuccessAlert";

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
            <SuccessAlert />
            <Switch>
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <PrivateRoute path="/listings" component={ProfileListings} />
              <PrivateRoute
                path="/profile/:user_id"
                exact
                component={Profile}
              />
              <PrivateRoute path="/bookings" exact component={Bookings} />
              <PrivateRoute
                path="/settings/editprofile"
                component={EditProfile}
              />
              <PrivateRoute path="/settings/photo" component={Photo} />
              <PrivateRoute
                path="/settings/availability"
                component={Availability}
              />
              <PrivateRoute path="/settings/payment" component={Payment} />
              <PrivateRoute path="/settings/security" component={Security} />
              <PrivateRoute path="/settings/account" component={Settings} />
              <PrivateRoute path="*" component={PageNotFound} />
            </Switch>
          </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;

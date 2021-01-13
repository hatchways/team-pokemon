import React, { useState } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { theme } from "./themes/theme";
import Navbar from "./components/navbar/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile"; //temporary name
import UserProvider from "./context/Context";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <UserProvider>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Navbar />
          <Route path="/">
            {loggedIn ? <Profile /> : <Redirect to="/signup" />}
          </Route>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
        </BrowserRouter>
      </MuiThemeProvider>
    </UserProvider>
  );
}

export default App;

import React, { useContext } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import { theme } from "./themes/theme";
//import LandingPage from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/navbar/Navbar";
//import Profile from "./pages/Profile"; //temporary name
import { UserContext } from "./context/Context";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const { isAuthenticated, setIsAuthenticated } = useContext(UserContext);

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar />
        <Route path="/" exact>
          {isAuthenticated ? (
            <Redirect to="/dashboard" />
          ) : (
            <Redirect to="/signup" />
          )}
        </Route>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;

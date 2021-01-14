import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";
import { theme } from "./themes/theme";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/navbar/Navbar";
import Profile from "./pages/Profile";
import Photo from "./pages/Photo";
import Availability from "./pages/Availability";
import Payment from "./pages/Payment";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <ProtectedRoute path="/" exact component={Profile} />
        <ProtectedRoute path="/dashboard/profile" component={Profile} />
        <ProtectedRoute path="/dashboard/photo" component={Photo} />
        <ProtectedRoute
          path="/dashboard/availability"
          component={Availability}
        />
        <ProtectedRoute path="/dashboard/payment" component={Payment} />
        <ProtectedRoute path="/dashboard/security" component={Security} />
        <ProtectedRoute path="/dashboard/settings" component={Settings} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;

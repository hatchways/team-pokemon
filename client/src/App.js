import React, { useState, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";

import "./App.css";
import { UserContext } from "./context/UserContext";

const axios = require("axios");

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const checkLoggedIn = async () => {
      const userRes = await axios.get("/api/getUser");
      if (userRes /* add check to see if user value was returned */) {
        setUser(userRes);
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <UserContext.Provider value={{ user, setUser }}>
          <Route path="/" component={LandingPage} />
        </UserContext.Provider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;

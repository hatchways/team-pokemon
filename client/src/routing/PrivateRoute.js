import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { UserContext } from "../context/UserContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        user ? <Redirect to="/" /> : <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;

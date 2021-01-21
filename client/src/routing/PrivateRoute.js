import React, { useContext, Fragment } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthStateContext } from "../context/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useContext(AuthStateContext);

  return (
    <Fragment>
      {!loading && ( // wait for reducer to complete setting state before deciding whether to redirect or not.
        <Route
          {...rest}
          render={props =>
            !isAuthenticated ? (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: { ...props.location } },
                }}
              />
            ) : (
              <Component {...props} />
            )
          }
        />
      )}
    </Fragment>
  );
};

export default PrivateRoute;

import React, { useContext } from "react";
import { logout } from "../actions/auth";
import { AuthDispatchContext } from "../context/AuthContext";

function TestingRoute() {
  const dispatch = useContext(AuthDispatchContext);
  return (
    <div>
      <h1>Hello There</h1>
      <button onClick={() => logout(dispatch)}>Logout</button>
    </div>
  );
}

export default TestingRoute;

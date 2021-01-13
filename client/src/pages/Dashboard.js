import React, { Component } from "react";

import { Typography, Grid, Container, Hidden, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core";
import { Route, Link } from "react-router-dom";

function Dashboard() {
  return (
    <Container>
      <Typography>Dashboard page</Typography>
    </Container>
  );
}

export default Dashboard;

import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { makeStyles } from "@material-ui/core";
import { UserContext } from "../../context/Context";

const useStyles = makeStyles(theme => ({
  root: { flexgrow: 1 },
  BackButton: {
    height: "60px",
    fontSize: "24px",
    borderRadius: "0",
  },
}));

function BackButton() {
  const { setDashboardDialogOpen } = useContext(UserContext);

  const classes = useStyles();

  return (
    <Button
      startIcon={<ArrowBackIcon color="primary" />}
      className={classes.BackButton}
      color="primary"
      variant="outlined"
      onClick={() => setDashboardDialogOpen(false)}
    >
      Back
    </Button>
  );
}

export default BackButton;

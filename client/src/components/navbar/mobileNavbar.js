import React, { useContext } from "react";
import {
  IconButton,
  Button,
  Box,
  Dialog,
  DialogActions,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/Context";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
  root: { flexgrow: 1 },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  gridElement: {
    maxWidth: "350px",
    width: "85%",
    textAlign: "center",
    height: "80px",
    margin: "30px auto 30px",
  },
  menuButton: {
    width: "100%",
    height: "100%",
    fontSize: "30px",
  },
}));

function MobileNavbar() {
  const { mobileMenuOpen, setMobileMenuOpen } = useContext(UserContext);
  const classes = useStyles();

  const handleClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Dialog open={mobileMenuOpen} fullScreen TransitionComponent={Transition}>
      <Box
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DialogActions
          style={{
            padding: "0",
          }}
        >
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <Grid
            container
            alignItems="center"
            justify="center"
            direction="column"
            style={{
              margin: "0",
              height: "100vh",
            }}
          >
            <Grid item className={classes.gridElement}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button className={classes.menuButton} onClick={handleClose}>
                  Login
                </Button>
              </Link>
            </Grid>
            <Grid item className={classes.gridElement}>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <Button className={classes.menuButton} onClick={handleClose}>
                  Sign Up
                </Button>
              </Link>
            </Grid>
            <Grid item className={classes.gridElement}>
              <Link to="/*" style={{ textDecoration: "none" }}>
                <Button className={classes.menuButton} onClick={handleClose}>
                  Become a Sitter
                </Button>
              </Link>
            </Grid>
          </Grid>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default MobileNavbar;

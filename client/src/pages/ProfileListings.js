import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { CssBaseline, Grid } from "@material-ui/core/";

import { makeStyles } from "@material-ui/core/styles";
import ProfileCard from "../components/profileListings/ProfileCard";
import SearchAndFilter from "../components/profileListings/SearchAndFilter";

import { AuthStateContext } from "../context/AuthContext";
import { UserContext } from "../context/Context";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function AlertMessage(props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (props.alert.error) {
      setOpen(true);
      setMessage(props.alert.message);
    } else {
      setOpen(false);
      setMessage("");
    }
  }, [props]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={60000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        {message}
      </Alert>
    </Snackbar>
  );
}

const useStyles = makeStyles(theme => ({
  gridContainer: {
    marginTop: theme.spacing(3),
    width: "100%",
  },
  errorAndLoading: {
    textAlign: "center",
  },
}));

function ProfileListings() {
  const classes = useStyles();
  const { filter, setFilter } = useContext(UserContext);
  const { profile } = useContext(AuthStateContext); //get profile from context
  const url = `/api/profile/list/${profile._id}`;
  const [alert, setAlert] = useState({ error: false, message: "" });
  const [sitters, setSitters] = useState({
    loading: false,
    data: null,
    error: undefined,
  });

  useEffect(() => {
    setFilter("");
  }, []);

  useEffect(() => {
    if (filter.dropOff && filter.pickUp && filter.dropOff > filter.pickUp) {
      setAlert({
        error: true,
        message: "Drop off date can not be past Pick up date",
      });
    } else {
      setAlert({ error: false, message: "" });
    }
  }, [filter]);

  useEffect(() => {
    setSitters({
      loading: true,
      data: null,
      error: undefined,
    });
    axios
      .get(url)
      .then(response => {
        setSitters({
          loading: false,
          data: response.data,
          error: undefined,
        });
      })
      .catch(error => {
        setSitters({
          loading: false,
          data: null,
          error: error.message,
        });
      });
  }, [url]);

  let content = null;

  //set sitters content to display
  if (sitters.error) {
    //if error occurs, display error message
    content = <h1>{sitters.error}</h1>;
  }
  if (sitters.loading) {
    // display a loading page while page is requesting data
    content = <h1>Loading...</h1>;
  }
  if (sitters.data) {
    // set profile data to display
    content = sitters.data
      .filter(sitter => {
        if (!filter || !filter.location) {
          return sitter;
        }
        if (filter && filter.location) {
          if (
            sitter.profile.address &&
            sitter.profile.address
              .toLowerCase()
              .includes(filter.location.toLowerCase().trim())
          ) {
            return sitter;
          }
        }
      })
      .filter(sitter => {
        if (!filter || !filter.dropOff) {
          return sitter;
        }
        if (filter && filter.dropOff) {
          if (
            sitter.profile.availability &&
            sitter.profile.availability.length > 0
          ) {
            return sitter.profile.availability.find(timeSlot => {
              if (
                moment(filter.dropOff).format("YYMMDD") ===
                  moment(timeSlot.start).format("YYMMDD") ||
                moment(filter.dropOff).format("YYMMDD") ===
                  moment(timeSlot.end).format("YYMMDD")
              ) {
                return sitter;
              }
            });
          }
        }
      })
      .filter(sitter => {
        if (!filter || !filter.pickUp) {
          return sitter;
        }
        if (filter && filter.pickUp) {
          if (
            sitter.profile.availability &&
            sitter.profile.availability.length > 0
          ) {
            return sitter.profile.availability.find(timeSlot => {
              if (
                moment(filter.pickUp).format("YYMMDD") ===
                  moment(timeSlot.end).format("YYMMDD") ||
                moment(filter.pickUp).format("YYMMDD") ===
                  moment(timeSlot.start).format("YYMMDD")
              ) {
                return sitter;
              }
            });
          }
        }
      })
      .map(sitter => (
        <ProfileCard
          key={sitter.profile._id}
          firstName={sitter.profile.firstName}
          lastName={sitter.profile.lastName}
          profilePicture={sitter.profile.profilePicture}
          address={sitter.profile.address}
          rating={4}
          price={sitter.profile.price}
          description={sitter.profile.description}
          userId={sitter._id}
        />
      ));
  }
  return (
    <React.Fragment>
      <CssBaseline />
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <SearchAndFilter />
        </Grid>
        <Grid item>
          <Grid
            container
            direction="row"
            spacing={3}
            align="center"
            justify="center"
            alignItems="center"
            className={classes.gridContainer}
          >
            {content}
          </Grid>
        </Grid>
        <AlertMessage alert={alert} />
      </Grid>
    </React.Fragment>
  );
}

export default ProfileListings;

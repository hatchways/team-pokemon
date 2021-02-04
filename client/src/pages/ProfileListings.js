import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { CssBaseline, Grid } from "@material-ui/core/";

import { makeStyles } from "@material-ui/core/styles";
import ProfileCard from "../components/profileListings/ProfileCard";
import SearchAndFilter from "../components/profileListings/SearchAndFilter";

import { AuthStateContext } from "../context/AuthContext";
import { UserContext } from "../context/Context";

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
  const { filter } = useContext(UserContext);
  const { profile } = useContext(AuthStateContext); //get profile from context
  const url = `/api/profile/list/${profile._id}`;
  const [alert, setAlert] = useState(false);
  const [sitters, setSitters] = useState({
    loading: false,
    data: null,
    error: undefined,
  });

  useEffect(() => {
    //console.log(filter);
    //SET ALERT FALSE INITIALLY
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
    if (filter.dropOff > filter.pickUp) {
      //SET ALERT HERE
    }
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
                moment(filter.dropOff).format("L") >=
                moment(timeSlot.start).format("L")
              ) {
                console.log(sitter.profile.availability);
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
                moment(filter.pickUp).format("L") <=
                moment(timeSlot.end).format("L")
              ) {
                console.log(sitter.profile.availability);
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
      </Grid>
    </React.Fragment>
  );
}

export default ProfileListings;

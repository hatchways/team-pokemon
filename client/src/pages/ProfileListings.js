import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CssBaseline, Grid } from "@material-ui/core/";

import { makeStyles } from "@material-ui/core/styles";
import ProfileCard from "../components/profileListings/ProfileCard";
import SearchAndFilter from "../components/profileListings/SearchAndFilter";

import { AuthStateContext } from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    marginTop: theme.spacing(3),
  },
  errorAndLoading: {
    textAlign: "center",
  },
}));

function ProfileListings() {
  const classes = useStyles();

  const { profile } = useContext(AuthStateContext); //get profile from context
  const url = `/api/profile/list/${profile._id}`;

  const [sitters, setSitters] = useState({
    loading: false,
    data: null,
    error: undefined,
  });

  useEffect(() => {
    setSitters({
      loading: true,
      data: null,
      error: undefined,
    });
    axios
      .get(url)
      .then((response) => {
        setSitters({
          loading: false,
          data: response.data,
          error: undefined,
        });
      })
      .catch((error) => {
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
    content = sitters.data.map((sitter) => (
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
      <Grid container direction='column' justify='center' alignItems='center'>
        <Grid item>
          <SearchAndFilter />
        </Grid>
        <Grid item>
          <Grid
            container
            direction='row'
            spacing={3}
            align='center'
            justify='center'
            alignItems='center'
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

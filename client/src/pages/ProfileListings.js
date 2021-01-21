import React, { useState, useEffect } from "react";
import axios from "axios";
import { CssBaseline, Grid } from "@material-ui/core/";

import { makeStyles } from "@material-ui/core/styles";
import ProfileCard from "../components/profileListings/ProfileCard";
import SearchAndFilter from "../components/profileListings/SearchAndFilter";

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
  const url = "/api/profile/";

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
        key={sitter._id}
        firstName={sitter.firstName}
        lastName={sitter.lastName}
        profilePicture={sitter.profilePicture}
        rating={4}
        description={sitter.description}
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
            justify='center'
            alignItems='flex-start'
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

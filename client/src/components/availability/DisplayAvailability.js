import React, { useState, useEffect, useContext } from "react";
import {
  AuthStateContext,
  AuthDispatchContext,
} from "../../context/AuthContext";
import { updateProfile } from "../../actions/profile";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, IconButton, Tooltip, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { format } from "date-fns";

const useStyles = makeStyles(theme => ({
  heading: {
    borderBottom: "1px solid grey",
  },
  timeCard: {
    margin: theme.spacing(2),
    maxWidth: 300,
    border: `3px solid ${theme.palette.primary.main}`,
    borderRadius: "1vw",
  },
  icon: {
    color: "black",
  },
  dateHeader: {
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
  availabilityBox: {
    width: "100%",
  },
}));

function DisplayAvailability() {
  const classes = useStyles();

  const { user, profile } = useContext(AuthStateContext); //get profile from context
  const dispatch = useContext(AuthDispatchContext);
  const [availability, setAvailability] = useState({
    data: null,
  });

  const handleDelete = (event, key) => {
    event.preventDefault();

    //create array to hold availability
    const arr = availability.data;
    arr.splice(key, 1);

    const updatedData = {
      email: user.email,
      availability: arr,
    };
    updateProfile(dispatch, updatedData, profile._id);
  };

  useEffect(() => {
    setAvailability({
      data: profile.availability,
    });
  }, [profile.availability]);

  let content = null;
  if (availability.data) {
    // set profile data to display
    content = availability.data.map((timeInterval, key) => (
      <Grid
        key={key}
        container
        item
        xs={12}
        md={3}
        justify="center"
        className={classes.timeCard}
      >
        <Grid item>
          <Typography variant="h6" className={classes.dateHeader}>
            {format(new Date(timeInterval.start), "dd MMMM, yyyy")}
          </Typography>
        </Grid>
        <Grid
          item
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            {format(new Date(timeInterval.start), "ha")} -{" "}
            {format(new Date(timeInterval.end), "ha")}
          </Typography>
          <Grid>
            <Tooltip title="Delete">
              <IconButton
                aria-label="delete"
                color="primary"
                onClick={e => {
                  handleDelete(e, key);
                }}
              >
                <DeleteIcon fontSize="large" className={classes.icon} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    ));
  }
  return (
    <div>
      <Grid
        container
        justify="center"
        spacing={3}
        className={classes.availabilityBox}
      >
        <Grid item container className={classes.heading} justify="center">
          <Typography component="h6" variant="h6">
            {" "}
            Your current availability
          </Typography>
        </Grid>
        <Grid item container>
          {content}
        </Grid>
      </Grid>
    </div>
  );
}

export default DisplayAvailability;

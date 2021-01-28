import React, { useState, useEffect, useContext }from 'react';
import { AuthStateContext, AuthDispatchContext } from "../../context/AuthContext";
import axios from "axios";
import {makeStyles} from "@material-ui/core/styles"
import {CircularProgress, Grid, Grow, IconButton, Paper, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
    timeCard: {
        margin: theme.spacing(2),
        border: `1px solid ${theme.palette.primary.main}`
    },
  }));

function DisplayAvailability(props){
    const classes= useStyles();
    const currentDate = props.currentDate;

    const { profile } = useContext(AuthStateContext); //get profile from context
    const url = `/api/availability/user/${profile._id}?date=${currentDate}`;
    const dispatch = useContext(AuthDispatchContext);

    const [timeIntervals, setTimeIntervals] = useState({
        loading: false,
        data: null,
        error: undefined
    });

    useEffect(() => {
        setTimeIntervals({
          loading: true,
          data: null,
          error: undefined,
        });
        axios
          .get(url)
          .then(response => {
            setTimeIntervals({
              loading: false,
              data: response.data,
              error: undefined,
            });
          })
          .catch(error => {
            setTimeIntervals({
              loading: false,
              data: null,
              error: error.message,
            });
          });
      }, [url]);

    let content = null;

    //set sitters content to display
    if (timeIntervals.error) {
        //if error occurs, display error message
        content = <h1>No availability found for {currentDate}</h1>;
    }
    if (timeIntervals.loading) {
        // display a loading page while page is requesting data
        content = <CircularProgress color="secondary" />;
    }
    if (timeIntervals.data) {
        // set profile data to display
        content = timeIntervals.data.map(timeInterval => (
            
                <Grid container item md={2} justify="center" className={classes.timeCard} spacing={3} wrap="nowrap">
                    <Grid item>
                        <Typography>
                        {timeInterval.from} - {timeInterval.to}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
        ));
    }
    return (
        <div>
            <Grid container spacing={3}>
                 {content}
            </Grid>
        </div>
    )
}

export default DisplayAvailability;
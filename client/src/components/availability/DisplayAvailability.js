import React, { useState, useEffect, useContext }from 'react';
import { AuthStateContext, AuthDispatchContext } from "../../context/AuthContext";
import {makeStyles} from "@material-ui/core/styles"
import {CircularProgress, Grid, Grow, IconButton, Paper, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
    timeCard: {
        margin: theme.spacing(2),
        border: `1px solid ${theme.palette.primary.main}`,
        display: "in"
    },
  }));

function DisplayAvailability(props){
    const classes= useStyles();
    const currentDate = props.currentDate;

    const dispatch = useContext(AuthDispatchContext)
    const { profile } = useContext(AuthStateContext); //get profile from context
    const [timeIntervals, setTimeIntervals] = useState({
        data: null,
        error: undefined
    });

    useEffect(() => {
      setTimeIntervals({
        data: profile.availability
      })
    }, [profile.availability]);

    let content = null;

    //set sitters content to display
   /*if (timeIntervals.data == null) {
        //if error occurs, display error message
        content = <h1>No availability found for {currentDate}</h1>;
    }
    /*
    if (timeIntervals.loading) {
        // display a loading page while page is requesting data
        content = <CircularProgress color="secondary" />;
    }*/
    if (timeIntervals.data) {
        // set profile data to display
        content = timeIntervals.data.map(timeInterval => (
                <Grid key={timeInterval._id} container item md={2} justify="center" className={classes.timeCard} spacing={3} wrap="nowrap">
                    <Grid item>
                        <Typography>
                        {timeInterval.start} - {timeInterval.end}
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
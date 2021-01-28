import React, { useState, useEffect, useContext }from 'react';
import { AuthStateContext } from "../../context/AuthContext";
import axios from "axios";
import {makeStyles} from "@material-ui/core/styles"
import {CircularProgress, Grid, Grow, Paper } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
    container: {
      flexGrow: 1,
      margin: theme.spacing(2)
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      border: `1px solid ${theme.palette.primary.main}`
    },
  }));

function DisplayAvailability(props){
    const classes= useStyles();
    const currentDate = props.currentDate;

    const { profile } = useContext(AuthStateContext); //get profile from context
    const url = `/api/availability/user/${profile._id}?date=${currentDate}`;

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
            <Grow in timeout={1000}>
                <Grid container md={3}>
                    <Grid item>
                        <Paper elevation={3} className={classes.paper}>
                        {timeInterval.from} - {timeInterval.to}
                        </Paper>
                    </Grid>
                    <Grid item>
                        <DeleteIcon />
                    </Grid>
                </Grid>
            </Grow>
        ));
    }
    return (
        <div className={classes.container}>
            <Grid container direction="row" spacing={3}>
                 {content}
            </Grid>
        </div>
    )
}

export default DisplayAvailability;
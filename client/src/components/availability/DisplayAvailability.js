import React, { useState, useEffect, useContext }from 'react';
import { AuthStateContext, AuthDispatchContext } from "../../context/AuthContext";
import {makeStyles} from "@material-ui/core/styles"
import {CircularProgress, Grid, Grow, IconButton, Paper, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import {format} from "date-fns";

const useStyles = makeStyles((theme) => ({
    timeCard: {
        margin: theme.spacing(2),
        border: `1px solid ${theme.palette.primary.main}`,
        display: "in",
        padding: theme.spacing(1)
    },
  }));

function DisplayAvailability(props){
    const classes= useStyles();
    const currentDate = props.currentDate;

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
    
    if (timeIntervals.data) {
        // set profile data to display
        content = timeIntervals.data.map(timeInterval => (
                <Grid key={timeInterval._id} container item xs={12} md={3} justify="center" className={classes.timeCard} spacing={3} wrap="nowrap">
                    <Grid item>
                        {/*<Typography>
                          {format(timeInterval.start, "YYYY-MM-DD HH:mm Z")}
                        </Typography>*/}
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
            <Grid container justify="center" spacing={3}>
                 {content}
            </Grid>
        </div>
    )
}

export default DisplayAvailability;
import React, { useState, useEffect, useContext }from 'react';
import { AuthStateContext, AuthDispatchContext } from "../../context/AuthContext";
import { updateProfile } from "../../actions/profile";
import {makeStyles} from "@material-ui/core/styles"
import {CircularProgress, Grid, Grow, IconButton, Tooltip, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import {format} from "date-fns";
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
    timeCard: {
        margin: theme.spacing(2),
        minWidth: 300 ,
        border: `3px solid ${theme.palette.primary.main}`,
        borderRadius: "1vw",
    },
    icon: {
      color: "black",
    },
    dateHeader: {
      borderBottom: `1px solid ${theme.palette.primary.main}`
    },
  }));

function DisplayAvailability(props){
    const classes= useStyles();
    const currentDate = props.currentDate;

    const { user, profile } = useContext(AuthStateContext); //get profile from context
    const dispatch = useContext(AuthDispatchContext)
    const [availability, setAvailability] = useState({
        data: null,
        error: undefined
    });

    const handleDelete =  (event, key) => {
      event.preventDefault();
     
      setAvailability({
        data: availability.data.splice(key,1)
      })
      const updatedData = {
        email: user.email,
        availability: availability.data
      }
      updateProfile(dispatch, updatedData, profile._id)
    }

    useEffect(() => {
      setAvailability({
        data: profile.availability
      })
    }, [profile.availability]);

    let content = null;
    
    if (availability.data) {
        // set profile data to display
        content = availability.data.map((timeInterval, key) => (
                <Grid key={key} container item xs={12} md={3} justify="center" className={classes.timeCard}>
                  <Grid item>
                    <Typography variant="h6"  className={classes.dateHeader}>
                      {format((new Date(timeInterval.start)), "dd MMMM, yyyy")}
                    </Typography>
                  </Grid>
                  <Grid item container direction="row" justify="space-between" alignItems="center">
                      <Typography variant="h6" >
                          {format((new Date(timeInterval.start)), "ha")} - {format((new Date(timeInterval.end)), "ha")}
                      </Typography>
                      <Grid >
                        <Tooltip title="Delete">
                          <IconButton aria-label="delete" color="primary" onClick={(e) => {handleDelete(e,key)}}>
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
            <Grid container justify="flex-start" spacing={3}>
                 {content}
            </Grid>
        </div>
    )
}

export default DisplayAvailability;
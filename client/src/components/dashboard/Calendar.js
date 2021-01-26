import React, { useState } from 'react';
import { takeMonth } from "../../modules/calendar";
import { Button, Grid, makeStyles, useMediaQuery, TextField } from '@material-ui/core';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import AddIcon from '@material-ui/icons/Add';
import {addMonths,format, isSameMonth, isSameDay, subMonths} from "date-fns";
import Popup from '../availability/Popup';
import SelectTimeForm from '../availability/SelectTimeForm';

const useStyles = makeStyles(theme => ({
  weekNames: {
      color: "#f04040",
      height: theme.spacing(3)
    },
  daysLgScreen: {
    height: theme.spacing(8),
    padding: theme.spacing(4),
    cursor: "pointer"
  },
  daysSmScreen: {
    height: theme.spacing(4),
  },
  notSameMonth: {
      color: "grey"
  },
  sameDay: {
      backgroundColor: "#f04040",
      color: "#ffffff",
      borderRadius: "5px"
  }
}));


function DisplayWeekNames(){
    const classes = useStyles();
    return(
    <Grid container item spacing={0} 
        direction="row"
        justify="center"
        alignItems="center">
    {
        ["S", "M", "T", "W", "T", "F", "S"].map(dayName => (
            <Grid item xs={1}
                align="center"
                className={classes.weekNames}>
                {dayName}
            </Grid>
        ))
    }
    </Grid>
)}
 
function Calendar(){
    const [currentDate, setCurrentDate] = useState(new Date());
    const[openPopup, setOpenPopup] = useState(false);
    const classes = useStyles();
    const data = takeMonth(currentDate)();
    const aboveSm = useMediaQuery("(min-width:600px)");
    
    function screenSize(){
        return aboveSm ? classes.daysLgScreen : classes.daysSmScreen
    }
    function dayColor(day){
        if(!isSameMonth(day, currentDate)) return classes.notSameMonth;
        if(isSameDay(day, currentDate)) return classes.sameDay;
    }
    function prevMonth(){
        setCurrentDate(subMonths(currentDate, 1))
    }
    function nextMonth(){
        setCurrentDate(addMonths(currentDate, 1));
    }
    return(
        <React.Fragment>
            <TextField id="outlined-basic" label="Price" variant="outlined" />
            <Grid container justify="center" alignItems="center">
                <Grid item>
                    <Button onClick={prevMonth}> <ArrowLeftIcon /> </Button>
                </Grid>
                <Grid item>
                    <h3>{format(currentDate,"MMM yyyy")}</h3>  
                </Grid>
                <Grid item>
                    <Button onClick={nextMonth}> <ArrowRightIcon /> </Button>
                </Grid>
                <Grid item>
                    <Button onClick={()=> setOpenPopup(true)}> <AddIcon fontSize="large"/> </Button>
                </Grid>
            </Grid>
            <Grid container direction="column" justify="center">
                <Grid item>
                <DisplayWeekNames />
                {
                    data.map(week => <Grid container item spacing={0} direction="row" justify="center" alignItems="center">
                        {
                            week.map(day => 
                            <Grid 
                                onClick={() => setCurrentDate(day)}
                                item xs={1}
                                align="center"
                                className={`${screenSize()} ${dayColor(day)}`}>
                                {format(day, "d")}
                            </Grid>)
                        }
                    </Grid> )
                    }
                    </Grid>
            </Grid>
            <Popup openPopup={openPopup} setOpenPopup={setOpenPopup}>
                <SelectTimeForm selectedDate={currentDate} />
            </Popup>
        </React.Fragment>
    );
}

export default Calendar;
import React, { useState } from 'react';
import { takeMonth } from "../../modules/calendar";
import { Button, Grid, makeStyles, useMediaQuery, TextField } from '@material-ui/core';
import {endOfWeek, endOfMonth,format, isSameMonth, isSameDay, startOfMonth, startOfWeek, startOfDay} from "date-fns";

const useStyles = makeStyles(theme => ({
  weekNames: {
      color: "#f04040",
      height: theme.spacing(5)
    },
  daysLg: {
    height: theme.spacing(8),
    padding: theme.spacing(4),
    cursor: "pointer"
  },
  daysSm: {
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
    const [selectedDate, setSelectedDate] = useState(new Date());
    const classes = useStyles();
    const data = takeMonth(selectedDate)();
    const aboveSm = useMediaQuery("(min-width:600px)");

    function screenSize(){
        return aboveSm ? classes.daysLg : classes.daysSm
    }
    function dayColor(day){
        if(!isSameMonth(day, selectedDate)) return classes.notSameMonth;
        if(isSameDay(day, selectedDate)) return classes.sameDay;
    }
    function prevMonth(){
        setSelectedDate(startOfWeek(startOfDay(startOfMonth(selectedDate))));
    }
    function nextMonth(){
        setSelectedDate(startOfDay(endOfWeek(endOfMonth(selectedDate))));
    }
    return(
        <React.Fragment>
            <TextField id="outlined-basic" label="Price" variant="outlined" />
            <Grid container spacing={3} justify="center" alignItems="center">
                <Grid item>
                    <Button onClick={prevMonth}> Prev </Button>
                </Grid>
                <Grid item>
                    <h1>{format(selectedDate,"MMMM")}</h1>  
                </Grid>
                <Grid item>
                    <Button onClick={nextMonth}> Next </Button>
                </Grid>
            </Grid>
            <Grid container direction="column" justify="center">
                <Grid item>
                <DisplayWeekNames />
                {
                    data.map(week => <Grid container item direction="row" justify="center" alignItems="center">
                        {
                            week.map(day => 
                            <Grid 
                                onClick={() => setSelectedDate(day)}
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
        </React.Fragment>
    );
}

export default Calendar;
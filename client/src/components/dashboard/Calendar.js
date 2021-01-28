import React, { useState } from 'react';
import { takeMonth } from "../../modules/calendar";
import { Button, ButtonGroup,Grid, makeStyles, useMediaQuery, Typography, Tooltip, Container } from '@material-ui/core';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import AddIcon from '@material-ui/icons/Add';
import {addMonths,format, isSameMonth, isSameDay, subMonths} from "date-fns";
import Popup from '../availability/Popup';
import SelectTimeForm from '../availability/SelectTimeForm';
import DisplayAvailability from '../availability/DisplayAvailability';

const useStyles = makeStyles(theme => ({
    container:{
        height: "100vh",
        width: "100vw",
    },
  weekNames: {
      color: "#ffffff",
      height: theme.spacing(4),
      paddingBottom: theme.spacing(2),
      minWidth: 35,
      background: theme.palette.primary.main
    },
  daysLgScreen: {
    height: theme.spacing(10),
    padding: theme.spacing(1),
    cursor: "pointer",
    border: "1px solid #cfd7e3"
  },
  daysSmScreen: {
    height: theme.spacing(5),
    border: "1px solid #cfd7e3",
    minWidth: 35,
  },
  notSameMonth: {
      color: "grey",
      background: "#e4e9f0"
  },
  sameDay: {
      backgroundColor: theme.palette.primary.main,
      color: "#ffffff",
  },
  header: {
      margin: theme.spacing(1)
  }
}));


function DisplayWeekNames(){
    const classes = useStyles();
    return(
    <Grid container item spacing={0} 
        direction="row"
        alignItems="center"
        wrap="nowrap"
        justify="center"
        >
    {
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(dayName => (
            <Grid item xs={2}
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
    const handleClick = (day) => {
        if(isSameDay(day, currentDate)){
            setOpenPopup(true);
            return;
        }
        setCurrentDate(day);
    }
    return(
        <React.Fragment>
            <Container >
                <Grid container item justify="space-between" alignItems="center" className={classes.header}>
                    <Typography variant="h5" align="center" component="h5">{format(currentDate,"MMM yyyy")}</Typography> 
                    <ButtonGroup size="small" color="primary"align="center" aria-label="small outlined button group">
                        <Button onClick={prevMonth}><ArrowLeftIcon /></Button>
                        <Button onClick={nextMonth}><ArrowRightIcon /></Button>
                        <Tooltip title="Add Availability" aria-label="add">
                            <Button variant="contained" color="primary" onClick={()=> setOpenPopup(true)}><AddIcon/></Button>
                        </Tooltip>
                    </ButtonGroup>            
                </Grid>
                <Grid item justify="center">
                    <DisplayWeekNames />
                    {
                        data.map(week => <Grid container item spacing={0} direction="row" wrap="nowrap" justify="center">
                            {
                                week.map(day => 
                                <Grid 
                                    onClick={() => handleClick(day)}
                                    item xs={2}
                                    align="right"
                                    className={`${screenSize()} ${dayColor(day)}`}>
                                    <Typography>{format(day, "d")}</Typography>
                                </Grid>)
                            }
                        </Grid> )
                        }
                </Grid>
            </Container>
            <Popup openPopup={openPopup} setOpenPopup={setOpenPopup}>
                <SelectTimeForm selectedDate={currentDate} />
            </Popup>
            <DisplayAvailability currentDate={format(currentDate, "yyyy-MM-dd")}/>
        </React.Fragment>
    );
}

export default Calendar;
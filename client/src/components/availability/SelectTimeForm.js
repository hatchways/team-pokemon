import React, { useState, useContext }from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Checkbox, FormControlLabel, Grid, TextField} from '@material-ui/core';
import {getMonth, getYear, getDate, isPast, isSameDay, isAfter} from "date-fns";
import { addAvailability } from "../../actions/profile";
import { AuthDispatchContext, AuthStateContext } from "../../context/AuthContext";
import AlertMessage from "../Alert";

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    textField: {
      margin: theme.spacing(1),
      width: 200,
    },
  }));

function AddTimeForm(props){
    const {selectedDate, setOpenPopup } = props;
    const classes = useStyles();
    //start and end time
    const [start, setStart] = useState("08:00");
    const [end, setEnd] = useState("16:00");
    const [alert, setAlert] = useState({ error: false, message: "" });
    //text add button displays
    const [addText, setAddText] = useState("ADD");
    const [disabled, setDisabled] = useState(false);
    const dispatch = useContext(AuthDispatchContext);
    const { profile } = useContext(AuthStateContext);
    const [checked, setChecked] = useState(true);
    
    const handleFromChange = (event) => {
        setAddText("ADD");
        setDisabled(false)
        setStart(event.target.value)
    }
    const handleToChange = (event) => {
        setAddText("ADD");
        setDisabled(false);
        setEnd(event.target.value);
    }
    const handleCheck = (event) => {
        setChecked(!checked)
        if(checked === true){
            setStart("00:00")
            setEnd("23:59")
        }
        else if(checked === false){
            setStart("08:00")
            setEnd("16:00")
        }
    }
    const handleSubmit =  (event) => {
        setAddText("ADDING...");
        event.preventDefault();
        //Date checking
        if(!selectedDate){
            setAlert({error:true, message: "Please Select Date!"});
            return
        }
        //check if date is in the past
        if(isPast(selectedDate) && !isSameDay(selectedDate, new Date())){
            setAlert({error: true, message: "Can't add availability to past date"});
            setAddText("ADD");
            return
        }

        const month = getMonth(selectedDate); // extract month, year and date
        const year = getYear(selectedDate);
        const date = getDate(selectedDate);

        const start_hour = parseInt(start.substring(0,2)) // extract start hour and end hour
        const start_minute = parseInt(start.substring(3))
        const end_hour = parseInt(end.substring(0,2))
        const end_minute = parseInt(end.substring(3))
        //construct new date with for start and end 
        const newDate = {
            start: new Date(year,month,date,start_hour,start_minute),
            end: new Date(year,month,date,end_hour,end_minute)
        }
        if(isAfter(newDate.start, newDate.end)){
            setAlert({error: true, message: "Invalid time interval. Start-time cannot be after end-time"});
            setAddText("ADD");
            return
        }
        //send time data to back-end
        addAvailability(dispatch, newDate, profile._id);
        setOpenPopup(false)
    }

    return (
        <form className={classes.container} >
            <Grid container>
            <FormControlLabel
                control={
                <Checkbox
                    checked={!checked}
                    onChange={handleCheck}
                    name="checked"
                    color="primary"
                />
                }
                label="All day"
            />
            <TextField
                id="start"
                label="From"
                variant="outlined"
                type="time"
                value={start}
                onChange={handleFromChange}
                className={classes.textField}
                InputLabelProps={{
                shrink: true,
                }}
                inputProps={{
                step: 300, // 5 min
                }}
            />
            <TextField
                id="end"
                label="To"
                variant="outlined"
                type="time"
                value={end}
                onChange={handleToChange}
                className={classes.textField}
                InputLabelProps={{
                shrink: true,
                }}
                inputProps={{
                step: 300, // 5 min
                }}
            />
            </Grid>
            <div>
                <Button color="primary" variant="contained" disabled={disabled} onClick={handleSubmit}> {addText} </Button>
            </div>
            <AlertMessage alert={alert} />
        </form>
      );
}

export default AddTimeForm;
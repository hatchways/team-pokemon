import React, { useState, useContext }from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, TextField} from '@material-ui/core';
import {getMonth, getYear, getDay} from "date-fns";
import { addAvailability } from "../../actions/profile";
import { AuthDispatchContext, AuthStateContext } from "../../context/AuthContext";
import AlertMessage from "../Alert";

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    textField: {
      margin: theme.spacing(1),
      width: 200,
    },
  }));

function AddTimeForm(props){
    const {selectedDate} = props;
    const classes = useStyles();
    const [start, setStart] = useState("08:00");
    const [end, setEnd] = useState("16:00");
    const [alert, setAlert] = useState({ error: false, message: "" });
    const [addText, setAddText] = useState("ADD");
    const [disabled, setDisabled] = useState(false);
    const dispatch = useContext(AuthDispatchContext);
    const { profile } = useContext(AuthStateContext);
    
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
    const handleSubmit = (event) => {
        event.preventDefault();
        setAddText("ADDING...");
        if(!selectedDate){
            setAlert({error:true, message: "Please Select Date!"});
            setAddText("ADD");
        }
        const month = getMonth(selectedDate);
        const year = getYear(selectedDate);
        const day = getDay(selectedDate);
        const start_hour = parseInt(start.substring(0,2))
        const start_minute = parseInt(start.substring(3))
        const end_hour = parseInt(end.substring(0,2))
        const end_minute = parseInt(end.substring(3))
        const availabilityData = {
            start: new Date(year,month,day,start_hour,start_minute),
            end: new Date(year,month,day,end_hour,end_minute)
        }
        //console.log(availabilityData)
        //send time data to back-end
        addAvailability(dispatch, availabilityData, profile._id);
        setAddText("ADDED");
        setDisabled(true);
    }
    return (
        <form className={classes.container} >
            <div>
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
            </div>
            <div>
                <Button variant="contained" disabled={disabled} onClick={handleSubmit}> {addText} </Button>
            </div>
            <AlertMessage alert={alert} />
        </form>
      );
}

export default AddTimeForm;
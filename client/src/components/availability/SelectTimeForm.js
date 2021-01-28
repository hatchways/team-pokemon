import React, { useState, useContext }from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, TextField} from '@material-ui/core';
import {format} from "date-fns";
import { addAvailability } from "../../actions/availability";
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
    const selectedDate = format(props.selectedDate, "yyyy-MM-dd");
    const classes = useStyles();
    const [selectedFrom, setSelectedFrom] = useState("08:00");
    const [selectedTo, setSelectedTo] = useState("16:00");
    const [alert, setAlert] = useState({ error: false, message: "" });
    const [addText, setAddText] = useState("ADD");
    const [disabled, setDisabled] = useState(false);
    const dispatch = useContext(AuthDispatchContext);
    const { profile } = useContext(AuthStateContext);
    
    const handleFromChange = (event) => {
        setAddText("ADD");
        setDisabled(false)
        setSelectedFrom(event.target.value)
    }
    const handleToChange = (event) => {
        setAddText("ADD");
        setDisabled(false);
        setSelectedTo(event.target.value);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setAddText("ADDING...");
        if(!selectedDate){
            setAlert({error:true, message: "Please Select Date!"});
            setAddText("ADD");
        }
        const availabilityData = {
            date: selectedDate,
            from: selectedFrom,
            to: selectedTo
        }
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
                value={selectedFrom}
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
                value={selectedTo}
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
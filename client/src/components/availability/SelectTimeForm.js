import React, { useState }from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, TextField} from '@material-ui/core';
import {format} from "date-fns";

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      
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
    
    const handleFromChange = (event) => {
        setSelectedFrom(event.target.value)
    }
    const handleToChange = (event) => {
        setSelectedTo(event.target.value)
    }
    const handleSubmit = () => {
        const timeData = {
            date: selectedDate,
            from: selectedFrom,
            to: selectedTo
        }
        console.log(timeData);
    }
    return (
        <form className={classes.container} noValidate>
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
                <Button color="primary" onClick={handleSubmit}> Add </Button>
            </div>
        </form>
      );
}

export default AddTimeForm;
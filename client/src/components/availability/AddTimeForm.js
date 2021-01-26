import React, { useState }from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, TextField} from '@material-ui/core';

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

function AddTimeForm(){
    const classes = useStyles();
    const [selectedFrom, setSelectedFrom] = useState();
    const [selectedTo, setSelectedTo] = useState();
    
    const handleFromChange = (event) => {
        setSelectedFrom(event.target.value)
    }
    const handleToChange = (event) => {
        setSelectedTo(event.target.value)
    }
    const handleSubmit = () => {
        const timeData = {
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
                defaultValue="08:00"
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
                defaultValue="09:00"
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
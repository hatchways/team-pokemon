import React, { useState, useContext } from "react";
import {
  AuthDispatchContext,
  AuthStateContext,
} from "../../context/AuthContext";
import { updateProfile } from "../../actions/profile";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: theme.spacing(3),
  },
  textField: {
    maxWidth: 100,
  },
  typography: {
    margin: theme.spacing(2),
  },
}));
function Pricing() {
  const { user, profile } = useContext(AuthStateContext);
  const dispatch = useContext(AuthDispatchContext);
  const [price, setPrice] = useState(profile.price);
  const [edited, setEdited] = useState(false);

  const classes = useStyles();

  const handleChange = (event) => {
    setEdited(true);
    setPrice(event.target.value);
  };
  const handleSubmit = () => {
    const updateData = {
      email: user.email,
      price: price,
    };
    updateProfile(dispatch, updateData, profile._id);
    setEdited(false);
  };
  return (
    <Grid
      container
      direction='row'
      justify='center'
      alignItems='flex-end'
      className={classes.container}
    >
      <Typography className={classes.typography} variant='body1' component='p'>
        price per hour
      </Typography>
      <Grid item>
        <TextField
          className={classes.textField}
          id='outlined-basic'
          label='price'
          variant='outlined'
          value={price}
          onChange={handleChange}
        />
        {edited && (
          <Button
            variant='contained'
            size='small'
            color='primary'
            onClick={handleSubmit}
          >
            {" "}
            Save{" "}
          </Button>
        )}
      </Grid>
    </Grid>
  );
}

export default Pricing;

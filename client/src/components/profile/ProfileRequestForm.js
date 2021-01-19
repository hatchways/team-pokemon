import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";

const useStyles = makeStyles(() => ({
  centerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  labelStyles: {
    fontWeight: "bold",
  },
  buttonStyles: {
    marginBottom: "25px",
    height: "50px",
    width: "50%",
  },
}));

function ProfileRequestForm() {
  const classes = useStyles();
  // Today's date to be passed as the minimum and default value to the 'drop off' date picker input.
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];

  const [dropOffDate, setDropOffDate] = useState(todayFormatted);
  const [pickUpDate, setPickUpDate] = useState(todayFormatted);

  const handleDropOffDateChange = (e) => {
    setDropOffDate(e.target.value);
    // If drop off date is later than pick up date, change pick up date to same day as drop off.
    if (e.target.value > pickUpDate) {
      setPickUpDate(e.target.value);
    }
  };

  const handlePickUpDateChange = (e) => {
    setPickUpDate(e.target.value);
    // If pick up date is earlier than drop off date, change drop off date to same day as pick up.
    if (e.target.value < dropOffDate) {
      setDropOffDate(e.target.value);
    }
  };
  return (
    <>
      <Typography
        variant="h4"
        style={{
          fontWeight: "bold",
          marginTop: "25px",
          marginBottom: "15px",
        }}
      >
        $14/hr
      </Typography>
      <Rating
        name="simple-controlled"
        value={3}
        readOnly
        style={{ paddingBottom: "25px" }}
      />
      <Box>
        <Box>
          <Typography className={classes.labelStyles}>DROP OFF</Typography>
        </Box>
        <Box style={{ marginBottom: "20px" }}>
          <TextField
            InputProps={{
              inputProps: { min: todayFormatted },
            }}
            type="date"
            value={dropOffDate}
            onChange={(e) => handleDropOffDateChange(e)}
            variant="outlined"
          ></TextField>
          <TextField
            select
            variant="outlined"
            value={"9 am"}
            style={{ width: "110px" }}
          >
            <MenuItem value={"9 am"}>9 am</MenuItem>
            <MenuItem value={"9:30 am"}>9:30 am</MenuItem>
          </TextField>
        </Box>
      </Box>
      <Box>
        <Box>
          <Typography className={classes.labelStyles}>PICK UP</Typography>
        </Box>
        <Box style={{ marginBottom: "30px" }}>
          <TextField
            InputProps={{
              inputProps: { min: dropOffDate },
            }}
            type="date"
            variant="outlined"
            value={pickUpDate}
            onChange={(e) => handlePickUpDateChange(e)}
          ></TextField>
          <TextField
            select
            variant="outlined"
            value={"10:30 am"}
            style={{ width: "110px" }}
          >
            <MenuItem value={"9 am"}>9 am</MenuItem>
            <MenuItem value={"10:30 am"}>10:30 am</MenuItem>
          </TextField>
        </Box>
      </Box>
      <Button
        color="primary"
        variant="contained"
        type="submit"
        size="large"
        className={classes.buttonStyles}
      >
        SEND REQUEST
      </Button>
    </>
  );
}

export default ProfileRequestForm;

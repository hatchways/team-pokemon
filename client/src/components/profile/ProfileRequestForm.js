import React, { useState, useContext } from "react";
import moment from "moment";
import Rating from "@material-ui/lab/Rating";
import {
  Box,
  Button,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  AuthDispatchContext,
  AuthStateContext,
} from "../../context/AuthContext";
import { createRequest } from "../../actions/request";

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

  // Get dispatch method and state from auth context
  const dispatch = useContext(AuthDispatchContext);
  const { user } = useContext(AuthStateContext);

  // Today's date to be passed as the minimum and default value to the 'drop off' date picker input.
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(todayFormatted);
  const [endDate, setEndDate] = useState(todayFormatted);
  const [startTime, setStartTime] = useState(
    moment()
      .add(moment().utcOffset() + 30, "minutes")
      .startOf("hour")
      .format("HH:mm")
  );
  const [endTime, setEndTime] = useState(
    moment()
      .add(moment().utcOffset() + 150, "minutes")
      .startOf("hour")
      .format("HH:mm")
  );
  const [requestFormData, setRequestFormData] = useState({
    sitterId: "600b0187e8129077501534bc",
    ownerId: user._id,
    // Default start date is 30 minutes from now rounded up to the nearest hour
    start: moment()
      .add(moment().utcOffset() + 30, "minutes")
      .startOf("hour")
      .format(),
    // Default end date is 2.5 hours from now rounded up to the nearest hour
    end: moment()
      .add(moment().utcOffset() + 150, "minutes")
      .startOf("hour")
      .format(),
  });

  // Handle change in 'Drop Off' (start) date input
  const handleStartDateChange = (e) => {
    const formattedStartDate = moment(
      new Date(`${e.target.value}T${startTime}`)
    ).format();

    setStartDate(e.target.value);

    // If start date is later than end date, change end date to same day as start date.
    if (e.target.value > endDate) {
      const formattedEndDate = moment(
        new Date(`${e.target.value}T${endTime}`)
      ).format();
      setEndDate(e.target.value);
      setRequestFormData({
        ...requestFormData,
        start: formattedStartDate,
        end: formattedEndDate,
      });
    } else {
      setRequestFormData({
        ...requestFormData,
        start: formattedStartDate,
      });
    }
  };

  // Handle change in 'Pick Up' (end) date input
  const handleEndDateChange = (e) => {
    const formattedEndDate = moment(
      new Date(`${e.target.value}T${endTime}`)
    ).format();

    setEndDate(e.target.value);

    // If end date is earlier than start date, change start date to same day as end date.
    if (e.target.value < startDate) {
      const formattedStartDate = moment(
        new Date(`${e.target.value}T${startDate}`)
      ).format();

      setStartDate(e.target.value);

      setRequestFormData({
        ...requestFormData,
        start: formattedStartDate,
        end: formattedEndDate,
      });
    } else {
      setRequestFormData({
        ...requestFormData,
        end: formattedEndDate,
      });
    }
  };

  // Handle change in 'Drop off' (start) time input
  const handleStartTimeChange = (e) => {
    const formattedStartDate = moment(
      new Date(`${startDate}T${e.target.value}`)
    ).format();

    setStartTime(e.target.value);

    setRequestFormData({
      ...requestFormData,
      start: formattedStartDate,
    });
  };

  // Handle change in 'Pick Up' (start) time input.
  const handleEndTimeChange = (e) => {
    const formattedEndDate = moment(
      new Date(`${endDate}T${e.target.value}`)
    ).format();

    setEndTime(e.target.value);

    setRequestFormData({
      ...requestFormData,
      end: formattedEndDate,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createRequest(dispatch, requestFormData);
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
            value={startDate}
            onChange={(e) => handleStartDateChange(e)}
            variant="outlined"
          ></TextField>
          <TextField
            inputProps={{
              step: 300, // 5 min
            }}
            type="time"
            value={startTime}
            className={classes.textField}
            variant="outlined"
            style={{ width: "120px" }}
            onChange={(e) => {
              handleStartTimeChange(e);
            }}
          />
        </Box>
      </Box>
      <Box>
        <Box>
          <Typography className={classes.labelStyles}>PICK UP</Typography>
        </Box>
        <Box style={{ marginBottom: "30px" }}>
          <TextField
            InputProps={{
              inputProps: { min: startDate },
            }}
            type="date"
            variant="outlined"
            value={endDate}
            onChange={(e) => handleEndDateChange(e)}
          ></TextField>
          <TextField
            inputProps={{
              step: 300, // 5 min
            }}
            type="time"
            value={endTime}
            className={classes.textField}
            variant="outlined"
            style={{ width: "120px" }}
            onChange={(e) => {
              handleEndTimeChange(e);
            }}
          />
        </Box>
      </Box>
      <Button
        color="primary"
        variant="contained"
        type="submit"
        size="large"
        className={classes.buttonStyles}
        onClick={(e) => handleSubmit(e)}
      >
        SEND REQUEST
      </Button>
    </>
  );
}

export default ProfileRequestForm;

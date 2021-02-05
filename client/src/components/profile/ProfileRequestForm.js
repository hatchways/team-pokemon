import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import Rating from "@material-ui/lab/Rating";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  makeStyles,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import {
  AuthDispatchContext,
  AuthStateContext,
} from "../../context/AuthContext";
import { createRequest } from "../../actions/request";
import { format, isBefore, isSameDay, parseISO } from "date-fns";
import Alert from "../Alert";
import { CLEAR_ERRORS } from "../../actions/types";

const useStyles = makeStyles(() => ({
  centerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  hourlyRateHeading: {
    fontWeight: "bold",
    marginTop: "25px",
    marginBottom: "15px",
  },
  ratingsAlignment: { paddingBottom: "25px" },
  labelStyles: {
    fontWeight: "bold",
  },
  inputGap: { marginBottom: "20px" },
  timeInputWidth: { width: "120px" },
  endDateAlign: { marginBottom: "30px" },
  buttonStyles: {
    marginBottom: "25px",
    height: "50px",
    width: "50%",
  },
}));

function ProfileRequestForm({ sitterId, sitterPrice, sitterAvailability }) {
  const classes = useStyles();

  // Get dispatch method and state from auth context
  const dispatch = useContext(AuthDispatchContext);
  const { user, alerts, errors } = useContext(AuthStateContext);

  // Today's date to be passed as the minimum and default value to the 'drop off' date picker input.
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];

  const [requestSending, setRequestSending] = useState(false);
  const [startDate, setStartDate] = useState(todayFormatted);
  const [endDate, setEndDate] = useState(todayFormatted);
  const [startTime, setStartTime] = useState(
    moment().add(30, "minutes").startOf("hour").format("HH:mm")
  );
  const [endTime, setEndTime] = useState(
    moment().add(150, "minutes").startOf("hour").format("HH:mm")
  );
  const [requestFormData, setRequestFormData] = useState({
    sitterId: sitterId,
    ownerId: user._id,
    // Default start date is 30 minutes from now rounded up to the nearest hour
    start: moment().add(30, "minutes").startOf("hour").format(),
    // Default end date is 2.5 hours from now rounded up to the nearest hour
    end: moment().add(150, "minutes").startOf("hour").format(),
  });

  // Changes 'Send Request' button from spinning to normal when alert pops ups
  useEffect(() => {
    if (alerts && alerts.length > 0) {
      setRequestSending(false);
    }
  }, [alerts]);

  const checkDate = (date) => {
    return isSameDay(parseISO(date.start), parseISO(startDate));
  };
  //clear any errors initially
  useEffect(() => {
    dispatch({ type: CLEAR_ERRORS });
  }, []);
  //if error occured - remove loading circle
  useEffect(() => {
    if (errors.length > 0) {
      setRequestSending(false);
    }
  }, [errors]);

  // Handle change in 'Drop Off' (start) date input
  const handleStartDateChange = (e) => {
    const formattedStartDate = moment(
      new Date(`${e.target.value}T${startTime}`)
    ).format();

    setStartDate(e.target.value);
    const result = sitterAvailability.find(checkDate);
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

  const handleSubmit = async (e) => {
    setRequestSending(true);
    e.preventDefault();
    console.log(requestFormData);
    createRequest(dispatch, requestFormData);
  };

  return (
    <>
      <Typography variant='h4' className={classes.hourlyRateHeading}>
        ${sitterPrice}/hr
      </Typography>
      <Rating
        name='simple-controlled'
        value={3}
        readOnly
        className={classes.ratingsAlignment}
      />
      <Box>
        <Box>
          <Typography className={classes.labelStyles}>DROP OFF</Typography>
        </Box>
        <Box className={classes.inputGap}>
          <FormControl variant='outlined'>
            <InputLabel htmlFor='start-date'>Date</InputLabel>
            <Select
              value={startDate}
              onChange={(e) => handleStartDateChange(e)}
              label='Date'
            >
              {sitterAvailability.map(
                (date) =>
                  !isBefore(parseISO(date.end), new Date()) && (
                    <MenuItem
                      key={date._id}
                      value={format(parseISO(date.start), "yyyy-MM-dd")}
                    >
                      {" "}
                      {format(parseISO(date.start), "MMMM dd, yyyy")}
                    </MenuItem>
                  )
              )}
            </Select>
          </FormControl>
          {/*
          <TextField
            InputProps={{
              inputProps: { min: todayFormatted },
            }}
            type='date'
            value={startDate}
            onChange={(e) => handleStartDateChange(e)}
            variant='outlined'
          ></TextField>*/}
          <TextField
            inputProps={{
              step: 300, // 5 min
            }}
            type='time'
            value={startTime}
            variant='outlined'
            className={classes.textField + " " + classes.timeInputWidth}
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
        <Box className={classes.endDateAlign}>
          <FormControl variant='outlined'>
            <InputLabel htmlFor='end-date'>Date</InputLabel>
            <Select
              value={endDate}
              onChange={(e) => handleEndDateChange(e)}
              label='Date'
            >
              {sitterAvailability.map(
                (date) =>
                  !isBefore(parseISO(date.end), new Date()) && (
                    <MenuItem
                      key={date._id}
                      value={format(parseISO(date.start), "yyyy-MM-dd")}
                    >
                      {" "}
                      {format(parseISO(date.start), "MMMM dd, yyyy")}
                    </MenuItem>
                  )
              )}
            </Select>
          </FormControl>
          {/*
          <TextField
            InputProps={{
              inputProps: { min: startDate },
            }}
            type='date'
            variant='outlined'
            value={endDate}
            onChange={(e) => handleEndDateChange(e)}
          ></TextField>*/}
          <TextField
            inputProps={{
              step: 300, // 5 min
            }}
            type='time'
            value={endTime}
            className={classes.textField + " " + classes.timeInputWidth}
            variant='outlined'
            onChange={(e) => {
              handleEndTimeChange(e);
            }}
          />
        </Box>
      </Box>
      <Button
        color='primary'
        variant='contained'
        type='submit'
        size='large'
        className={classes.buttonStyles}
        onClick={(e) => handleSubmit(e)}
      >
        {requestSending ? (
          <CircularProgress color='white' size={20} />
        ) : (
          `SEND REQUEST`
        )}
      </Button>
      {errors.length > 0 && (
        <Alert alert={{ error: true, message: errors[0] }} />
      )}
    </>
  );
}

export default ProfileRequestForm;

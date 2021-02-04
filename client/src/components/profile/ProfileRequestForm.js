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
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import {
  AuthDispatchContext,
  AuthStateContext,
} from "../../context/AuthContext";
import { createRequest } from "../../actions/request";
import { eachHourOfInterval, format } from "date-fns";

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
  const { user, alerts } = useContext(AuthStateContext);

  // Today's date to be passed as the minimum and default value to the 'drop off' date picker input.
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];

  const [requestSending, setRequestSending] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [requestFormData, setRequestFormData] = useState({
    sitterId: sitterId,
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
  const [startHourInterval, setStartHourInterval] = useState([]);
  const [endHourInterval, seEndhourInterval] = useState([]);
  const [index, setIndex] = useState();

  // Changes 'Send Request' button from spinning to normal when alert pops ups
  useEffect(() => {
    if (alerts && alerts.length > 0) {
      setRequestSending(false);
    }
  }, [alerts]);

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
    setRequestSending(true);
    e.preventDefault();
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
            <InputLabel id='dropoff-date'>date</InputLabel>
            <Select
              labelId='demo-simple-select-outlined-label'
              id='demo-simple-select-outlined'
              value={startDate}
              onChange={(e) => handleStartDateChange(e)}
              label='Drop Off Date'
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {sitterAvailability.map((date, key) => (
                <MenuItem
                  key={key}
                  value={format(new Date(date.start), "yyyy-MM-dd")}
                >
                  {format(new Date(date.start), "dd MMMM, yyyy")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant='outlined'>
            <InputLabel id='dropoff-date'>time</InputLabel>
            <Select
              labelId='demo-simple-select-outlined-label'
              id='demo-simple-select-outlined'
              value={startTime}
              onChange={(e) => handleStartTimeChange(e)}
              label='Drop Off Time'
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            InputProps={{
              inputProps: { min: todayFormatted },
            }}
            type='date'
            value={startDate}
            onChange={(e) => handleStartDateChange(e)}
            variant='outlined'
          ></TextField>
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
            <InputLabel id='pickup-date'>date</InputLabel>
            <Select
              labelId='demo-simple-select-outlined-label'
              id='demo-simple-select-outlined'
              value={endDate}
              onChange={(e) => handleEndDateChange(e)}
              label='Age'
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {sitterAvailability.map((date) => (
                <MenuItem
                  key={date._id}
                  value={format(new Date(date.start), "yyyy-MM-dd")}
                >
                  {format(new Date(date.start), "dd MMMM, yyyy")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant='outlined'>
            <InputLabel id='pickup-date'>time</InputLabel>
            <Select
              labelId='demo-simple-select-outlined-label'
              id='demo-simple-select-outlined'
              value={endTime}
              onChange={(e) => handleEndDateChange(e)}
              label='endTime'
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <TextField
            InputProps={{
              inputProps: { min: startDate },
            }}
            type='date'
            variant='outlined'
            value={endTime}
            onChange={(e) => handleEndTimeChange(e)}
          ></TextField>
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
    </>
  );
}

export default ProfileRequestForm;

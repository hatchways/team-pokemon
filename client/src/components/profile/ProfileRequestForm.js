import React, { useState, useContext } from "react";
import Rating from "@material-ui/lab/Rating";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import {
  AuthDispatchContext,
  AuthStateContext,
} from "../../context/AuthContext";
import { createRequest } from "../../actions/request";
import { formatDateTime } from "../../utils/formatDateTime";

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
  // const dispatch = useContext(AuthDispatchContext);
  const { user } = useContext(AuthStateContext);

  // Today's date to be passed as the minimum and default value to the 'drop off' date picker input.
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(todayFormatted);
  const [endDate, setEndDate] = useState(todayFormatted);
  const [startTime, setStartTime] = useState("09:00:00");
  const [endTime, setEndTime] = useState("10:30:00");
  const [requestFormData, setRequestFormData] = useState({
    sitterId: "600b0187e8129077501534bc",
    ownerId: user._id,
    start: "",
    end: "",
  });

  // Handle change in 'Drop Off' (start) date input
  const handleStartDateChange = (e) => {
    const formattedStartDate = formatDateTime(e.target.value, startTime);

    setStartDate(e.target.value);

    // If start date is later than end date, change end date to same day as start date.
    if (e.target.value > endDate) {
      const formattedEndDate = formatDateTime(e.target.value, endTime);
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
    const formattedEndDate = formatDateTime(e.target.value, endTime);

    setEndDate(e.target.value);

    // If end date is earlier than start date, change start date to same day as end date.
    if (e.target.value < endDate) {
      const formattedStartDate = formatDateTime(e.target.value, startTime);
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
    const formattedStartDate = formatDateTime(startDate, e.target.value);

    setStartTime(e.target.value);

    setRequestFormData({
      ...requestFormData,
      start: formattedStartDate,
    });
  };

  // Handle change in 'Pick Up' (start) time input.
  const handleEndTimeChange = (e) => {
    const formattedEndDate = formatDateTime(endDate, e.target.value);

    setEndTime(e.target.value);

    setRequestFormData({
      ...requestFormData,
      end: formattedEndDate,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createRequest(requestFormData);
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
            select
            variant="outlined"
            value={startTime}
            style={{ width: "110px" }}
            onChange={(e) => {
              handleStartTimeChange(e);
            }}
          >
            <MenuItem value={"09:00:00"}>9 am</MenuItem>
            <MenuItem value={"09:30:00"}>9:30 am</MenuItem>
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
              inputProps: { min: startDate },
            }}
            type="date"
            variant="outlined"
            value={endDate}
            onChange={(e) => handleEndDateChange(e)}
          ></TextField>
          <TextField
            select
            variant="outlined"
            value={endTime}
            style={{ width: "110px" }}
            onChange={(e) => {
              handleEndTimeChange(e);
            }}
          >
            <MenuItem value={"09:00:00"}>9 am</MenuItem>
            <MenuItem value={"10:30:00"}>10:30 am</MenuItem>
            <MenuItem value={"14:30:00"}>2:30 pm</MenuItem>
          </TextField>
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

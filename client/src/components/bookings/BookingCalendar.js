import React from "react";
import "./BookingCalendar.css";
import { Calendar } from "react-modern-calendar-datepicker";
import { Box, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  Calendar__monthYear: {
    fontSize: "20px !important",
  },
}));

function BookingCalendar() {
  const classes = useStyles();
  const preselectedDays = [
    {
      year: 2021,
      month: 1,
      day: 2,
    },
    {
      year: 2021,
      month: 1,
      day: 10,
    },
    {
      year: 2021,
      month: 1,
      day: 8,
    },
  ];
  return (
    <Calendar
      className={classes.Calendar__monthYear}
      colorPrimary="#f04040"
      value={preselectedDays}
      style={{ fontSize: "30px !important" }}
    />
  );
}

export default BookingCalendar;

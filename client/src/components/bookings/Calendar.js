import React, { useState, useEffect } from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";
import moment from "moment";

import buildCalendar from "../../utils/bookingCalendar";

const useStyles = makeStyles(() => ({
  calendar: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: "5px",
    padding: "30px",
    width: "610px",
    height: "450px",
    marginTop: "65px",
    marginBottom: "40px",
  },
  week: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  day: {
    padding: "10px",
    width: "30px",
    height: "30px",
    textAlign: "center",
    fontWeight: "500",
    fontSize: "20px",
  },
  calendarHeader: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "30px",
    fontSize: "25px",
  },
  calendarHeading: {
    color: "#f04040",
    fontSize: "25px",
    fontWeight: "bold",
  },
  calendarArrow: {
    color: "#e6e6e6",
    fontSize: "25px",
    fontWeight: "bold",
    "&:hover": {
      cursor: "pointer",
    },
  },
  weekContainer: {
    width: "100%",
    marginTop: "auto",
    marginBottom: "auto",
  },
  daySelected: {
    backgroundColor: "#f04040",
    borderRadius: "50%",
  },
  selected: {
    color: "white",
  },
  before: {
    color: "#e6e6e6",
  },
}));

function Calendar({ sitterMode, currentSitterBookings, currentOwnerBookings }) {
  const classes = useStyles();
  const [calendar, setCalendar] = useState([]);
  const [value, setValue] = useState(moment());

  useEffect(() => {
    setCalendar(buildCalendar(value));
  }, [value]);

  const currMonthName = () => {
    return value.format("MMMM");
  };

  const currYear = () => {
    return value.format("YYYY");
  };

  const prevMonth = () => {
    return value.clone().subtract(1, "month");
  };

  const nextMonth = () => {
    return value.clone().add(1, "month");
  };

  const thisMonth = () => {
    return value.isSame(new Date(), "month");
  };

  return (
    <Box className={classes.calendar}>
      <Box className={classes.calendarHeader}>
        <Box
          className={classes.calendarArrow}
          onClick={() => setValue(prevMonth())}
        >
          {!thisMonth() ? "<" : null}
        </Box>
        <Typography className={classes.calendarHeading}>
          {currMonthName()} {currYear()}
        </Typography>
        <Box
          className={classes.calendarArrow}
          onClick={() => setValue(nextMonth())}
        >
          &gt;
        </Box>
      </Box>
      <Box className={classes.weekContainer}>
        {calendar.map((week, index) => (
          <Box className={classes.week} key={index}>
            {week.map((day, index) => (
              <Box
                key={index}
                className={
                  sitterMode &&
                  currentSitterBookings.indexOf(
                    moment(day).format("DD MM YY")
                  ) !== -1 &&
                  !day.isAfter(value.clone().endOf("month"), "day") &&
                  !day.isBefore(value.clone().startOf("month"), "day")
                    ? classes.daySelected
                    : [
                        !sitterMode &&
                        currentOwnerBookings.indexOf(
                          moment(day).format("DD MM YY")
                        ) !== -1 &&
                        !day.isAfter(value.clone().endOf("month"), "day") &&
                        !day.isBefore(value.clone().startOf("month"), "day")
                          ? classes.daySelected
                          : classes.day,
                      ]
                }
              >
                <Box
                  className={
                    sitterMode &&
                    currentSitterBookings.indexOf(
                      moment(day).format("DD MM YY")
                    ) !== -1 &&
                    !day.isAfter(value.clone().endOf("month"), "day") &&
                    !day.isBefore(value.clone().startOf("month"), "day")
                      ? classes.selected + " " + classes.day
                      : [
                          !sitterMode &&
                          currentOwnerBookings.indexOf(
                            moment(day).format("DD MM YY")
                          ) !== -1 &&
                          !day.isAfter(value.clone().endOf("month"), "day") &&
                          !day.isBefore(value.clone().startOf("month"), "day")
                            ? classes.selected + " " + classes.day
                            : [
                                day.isBefore(
                                  value.clone().startOf("month"),
                                  "day"
                                ) ||
                                day.isAfter(value.clone().endOf("month"), "day")
                                  ? classes.before
                                  : "",
                              ],
                        ]
                  }
                >
                  {day.format("D")}
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Calendar;

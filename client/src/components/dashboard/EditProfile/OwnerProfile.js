import React, { useState } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { getYears, getMonths, getDays } from "./BirthDatePicker";

const useStyles = makeStyles((theme) => ({
  vertAlign: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}));

function OwnerProfile() {
  const classes = useStyles();
  const [editPhone, toggleEditPhone] = useState(false);

  // Edit profile form's state
  const [profileData, setProfileData] = useState({
    fistName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    email: "",
    phoneNumber: "",
    address: "",
    description: "",
  });

  // Destructure form field state
  const {
    firstName,
    lastName,
    gender,
    birthDate,
    email,
    phoneNumber,
    address,
    description,
  } = profileData;

  // Birth date state (year, month, and day are obtained separately and then need to be formatted before sending request)
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");

  // Helper functions that return an array of years, months, and days.
  const yearArray = getYears();
  const monthArray = getMonths(birthYear);
  const dayArray = getDays(birthMonth);

  // Year, month, and day arrays are converted to <MenuItem> components which will be passed as options to our <Select> dropdown input.
  const yearMenuItem = yearArray.map((year) => (
    <MenuItem key={year} value={year}>
      {year}
    </MenuItem>
  ));
  const monthMenuItem = monthArray.map((month) => (
    <MenuItem key={month["idx"]} value={month["idx"]}>
      {month["name"]}
    </MenuItem>
  ));
  const dayMenuItem = dayArray.map((day) => (
    <MenuItem key={day} value={day}>
      {day}
    </MenuItem>
  ));

  // Function that handles changes to birth date (year, month, and date <Select> input).
  const handleBirthDateChange = (e) => {
    let formattedDate;
    if (birthDay > dayArray[dayArray.length - 1]) {
      setBirthDay(dayArray[dayArray.length - 1]);
      formattedDate = new Date(
        dayArray[dayArray.length - 1],
        birthMonth,
        birthDay
      );
    }
    if (e.target.name === "birthDay") {
      setBirthDay(e.target.value);
      formattedDate = new Date(birthYear, birthMonth, e.target.value);
    }
    if (e.target.name === "birthMonth") {
      setBirthMonth(e.target.value);
      formattedDate = new Date(birthYear, e.target.value, birthDay);
    }
    if (e.target.name === "birthYear") {
      formattedDate = new Date(e.target.value, birthMonth, birthDay);
    }
    console.log(formattedDate);
  };

  // Function that updates the state when changes are made
  const onChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Grid container spacing={3} style={{ width: "80%", paddingTop: "10px" }}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center">
          Edit Profile
        </Typography>
      </Grid>
      <Grid item sm={4} md={3} className={classes.vertAlign}>
        <Typography align="right" fontWeight={500}>
          FIRST NAME
        </Typography>
      </Grid>
      <Grid item sm={8} md={9}>
        <TextField
          variant="outlined"
          name="fistName"
          placeholder="John"
          fullWidth={true}
          onChange={(e) => onChange(e)}
          value={firstName}
          required
        />
      </Grid>
      <Grid item sm={4} md={3} className={classes.vertAlign}>
        <Typography align="right">LAST NAME</Typography>
      </Grid>
      <Grid item sm={8} md={9}>
        <TextField
          variant="outlined"
          name="lastName"
          placeholder="Doe"
          fullWidth={true}
          onChange={(e) => onChange(e)}
          value={lastName}
          required
        />
      </Grid>
      <Grid item sm={3} className={classes.vertAlign}>
        <Typography align="right">GENDER</Typography>
      </Grid>
      <Grid item sm={9}>
        <Select
          disableUnderline
          name="gender"
          displayEmpty
          placeholder="Male"
          value={gender ? gender : ""}
          onChange={(e) => onChange(e)}
          MenuProps={{
            // moves the menu below the select input
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            getContentAnchorEl: null,
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
      </Grid>
      <Grid item sm={3} className={classes.vertAlign}>
        <Typography align="right">BIRTH DATE</Typography>
      </Grid>
      <Grid item sm={9}>
        <Select
          name="birthMonth"
          onChange={(e) => {
            handleBirthDateChange(e);
          }}
          value={
            birthMonth ? birthMonth : monthArray[monthArray.length - 1]["idx"]
          }
        >
          {monthMenuItem}
        </Select>
        <Select
          name="birthDay"
          onChange={(e) => handleBirthDateChange(e)}
          value={
            birthDay && birthDay <= dayArray[dayArray.length - 1]
              ? birthDay
              : dayArray[dayArray.length - 1]
          }
        >
          {dayMenuItem}
        </Select>
        <Select
          name="birthYear"
          onChange={(e) => handleBirthDateChange(e)}
          value={birthYear ? birthYear : yearArray[0]}
        >
          {yearMenuItem}
        </Select>
      </Grid>
      <Grid item sm={3} className={classes.vertAlign}>
        <Typography align="right">EMAIL ADDRESS</Typography>
      </Grid>
      <Grid item sm={9}>
        <TextField
          variant="outlined"
          type="email"
          name="email"
          placeholder="john-doe@gmail.com"
          value={email}
          onChange={(e) => onChange(e)}
          fullWidth={true}
          required
        />
      </Grid>
      <Grid item sm={3} className={classes.vertAlign}>
        <Typography align="right">PHONE NUMBER</Typography>
      </Grid>
      <Grid item sm={9}>
        <Grid container spacing={2}>
          <Grid item xs={6} className={classes.vertAlign}>
            {editPhone ? (
              <TextField
                variant="outlined"
                name="phoneNumber"
                fullWidth={true}
                value={phoneNumber}
                onChange={(e) => onChange(e)}
              ></TextField>
            ) : (
              [
                phoneNumber ? (
                  <Typography>{phoneNumber}</Typography>
                ) : (
                  <Typography>
                    <em>No Phone Number Added</em>
                  </Typography>
                ),
              ]
            )}
          </Grid>
          <Grid item xs={6}>
            <Button onClick={() => toggleEditPhone(!editPhone)}>
              {editPhone ? "Save" : "Add a phone Number"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={3} className={classes.vertAlign}>
        <Typography align="right">WHERE YOU LIVE</Typography>
      </Grid>
      <Grid item sm={9}>
        <TextField
          variant="outlined"
          name="address"
          placeholder="Address"
          fullWidth={true}
          value={address}
          onChange={(e) => onChange(e)}
        />
      </Grid>
      <Grid item sm={3} className={classes.vertAlign}>
        <Typography align="right">DESCRIBE YOURSELF</Typography>
      </Grid>
      <Grid item sm={9}>
        <TextField
          multiline={true}
          rows={5}
          variant="outlined"
          name="description"
          placeholder="About you"
          fullWidth={true}
          value={description}
          onChange={(e) => onChange(e)}
        />
      </Grid>
      <Grid item sm={12} align="center">
        <Button type="submit" variant="contained" size="large" color="primary">
          SAVE
        </Button>
      </Grid>
    </Grid>
  );
}

export default OwnerProfile;

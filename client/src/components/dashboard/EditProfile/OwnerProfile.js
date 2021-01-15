import React, { useState } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { getYears, getMonths, getDays } from "./birthDateUtils";
import AlertMessage from "../../Alert";

const useStyles = makeStyles(() => ({
  vertAlign: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  labelStyles: {
    fontWeight: "bold",
  },
}));

function OwnerProfile() {
  const classes = useStyles();
  const [alert, setAlert] = useState({ error: false, message: "" });

  // Edit profile form's state
  const [profileData, setProfileData] = useState({
    isSitter: false,
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
    isSitter,
    firstName,
    lastName,
    gender,
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
      setBirthYear(e.target.value);
      formattedDate = new Date(e.target.value, birthMonth, birthDay);
    }

    setAlert({ error: false, message: "" });

    setProfileData({
      ...profileData,
      birthDate: formattedDate,
    });
  };

  // Function that updates the state when changes are made
  const onChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
    setAlert({ error: false, message: "" });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName) {
      setAlert({ error: true, message: "First Name is Required!" });
      return;
    }

    if (!lastName) {
      setAlert({ error: true, message: "First Name is Required!" });
      return;
    }

    // Check whether the birth date input was incorrectly selected
    if (
      (!birthDay && birthMonth) ||
      (!birthDay && birthYear) ||
      (birthDay && !birthMonth) ||
      (!birthMonth && birthYear) ||
      (!birthYear && birthMonth)
    ) {
      setAlert({ error: true, message: "Invalid Birth Date!" });
      return;
    }

    // Passed validation
  };

  return (
    <Grid container spacing={3} style={{ width: "80%", paddingTop: "30px" }}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center" style={{ fontWeight: "bold" }}>
          Edit Profile
        </Typography>
      </Grid>
      <Grid item sm={4} md={3} className={classes.vertAlign}>
        <Typography align="right" className={classes.labelStyles}>
          I'M A SITTER
        </Typography>
      </Grid>
      <Grid item sm={8} md={9}>
        <Switch
          color="primary"
          name="isSitter"
          checked={isSitter}
          onChange={(e) => {
            setProfileData({
              ...profileData,
              [e.target.name]: e.target.checked,
            });
            setAlert({ error: false, message: "" });
          }}
        />
      </Grid>
      <Grid item sm={4} md={3} className={classes.vertAlign}>
        <Typography align="right" className={classes.labelStyles}>
          FIRST NAME
        </Typography>
      </Grid>
      <Grid item sm={8} md={9}>
        <TextField
          variant="outlined"
          name="firstName"
          placeholder="John"
          fullWidth={true}
          onChange={(e) => onChange(e)}
          value={firstName}
          required
        />
      </Grid>
      <Grid item sm={4} md={3} className={classes.vertAlign}>
        <Typography align="right" className={classes.labelStyles}>
          LAST NAME
        </Typography>
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
      <Grid item sm={4} md={3} className={classes.vertAlign}>
        <Typography align="right" className={classes.labelStyles}>
          GENDER
        </Typography>
      </Grid>
      <Grid item sm={8} md={9}>
        <TextField
          select
          variant="outlined"
          name="gender"
          value={gender ? gender : ""}
          onChange={(e) => onChange(e)}
          style={{ width: "50%" }}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </TextField>
      </Grid>
      <Grid item sm={4} md={3} className={classes.vertAlign}>
        <Typography align="right" className={classes.labelStyles}>
          BIRTH DATE
        </Typography>
      </Grid>
      <Grid
        item
        sm={8}
        md={9}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <TextField
          select
          variant="outlined"
          name="birthMonth"
          label="Month"
          onChange={(e) => {
            handleBirthDateChange(e);
          }}
          value={birthMonth}
          style={{ width: "30%" }}
        >
          {monthMenuItem}
        </TextField>
        <TextField
          select
          variant="outlined"
          name="birthDay"
          label="Day"
          onChange={(e) => handleBirthDateChange(e)}
          value={birthDay}
          style={{ width: "30%" }}
        >
          {dayMenuItem}
        </TextField>
        <TextField
          select
          variant="outlined"
          name="birthYear"
          label="Year"
          onChange={(e) => handleBirthDateChange(e)}
          value={birthYear}
          style={{ width: "30%" }}
        >
          {yearMenuItem}
        </TextField>
      </Grid>
      <Grid item sm={3} className={classes.vertAlign}>
        <Typography align="right" className={classes.labelStyles}>
          EMAIL ADDRESS
        </Typography>
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
        <Typography align="right" className={classes.labelStyles}>
          PHONE NUMBER
        </Typography>
      </Grid>
      <Grid item sm={9}>
        <TextField
          variant="outlined"
          name="phoneNumber"
          placeholder="Your Phone Number"
          fullWidth={true}
          value={phoneNumber}
          onChange={(e) => onChange(e)}
        />
      </Grid>
      <Grid item sm={3} className={classes.vertAlign}>
        <Typography align="right" className={classes.labelStyles}>
          WHERE YOU LIVE
        </Typography>
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
        <Typography align="right" className={classes.labelStyles}>
          DESCRIBE YOURSELF
        </Typography>
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
        <Button
          disabled={false}
          style={{
            height: "60px",
            width: "30%",
            marginTop: "25px",
          }}
          type="submit"
          variant="contained"
          size="large"
          color="secondary"
          onClick={(e) => handleSubmit(e)}
        >
          SAVE
        </Button>
        <AlertMessage alert={alert} />
      </Grid>
    </Grid>
  );
}

export default OwnerProfile;

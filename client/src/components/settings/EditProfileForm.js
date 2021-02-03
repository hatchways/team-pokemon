import React, { useState, useEffect, useContext } from "react";
import {
  CircularProgress,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  MenuItem,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core";
import { getYears, getMonths, getDays } from "../../utils/birthDate";
import AlertMessage from "../Alert";
import {
  AuthDispatchContext,
  AuthStateContext,
} from "../../context/AuthContext";
import { updateProfile } from "../../actions/profile";

const useStyles = makeStyles(() => ({
  vertAlign: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  formContainer: { width: "80%", paddingTop: "30px" },
  heading: { fontWeight: "bold", marginBottom: "20px" },
  labelStyles: {
    fontWeight: "bold",
  },
  genderInput: { width: "50%" },
  birthDateContainer: { display: "flex", justifyContent: "space-between" },
  birthDateInput: { width: "30%" },
  saveButton: { height: "60px", width: "30%", margin: "25px 0" },
}));

function EditProfileForm() {
  const classes = useStyles();
  const aboveSm = useMediaQuery("(min-width:600px)");

  // Component's local state
  const [alert, setAlert] = useState({ error: false, message: "" });
  const [updatingProfileSpinner, setUpdatingProfileSpinner] = useState(false);

  // Get dispatch method and state from auth context
  const dispatch = useContext(AuthDispatchContext);
  const { user, profile, alerts } = useContext(AuthStateContext);

  // Edit profile form's state
  const [profileData, setProfileData] = useState({
    isSitter: false,
    firstName: "",
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

  // Populate form fields with data from back end
  useEffect(() => {
    profile.birthDate && setBirthYear(parseInt(profile.birthDate.slice(0, 4)));
    profile.birthDate &&
      setBirthMonth(parseInt(profile.birthDate.slice(5, 7)) - 1);
    profile.birthDate && setBirthDay(parseInt(profile.birthDate.slice(8)));
    setProfileData({
      isSitter: profile.isSitter ? profile.isSitter : false,
      firstName: profile.firstName ? profile.firstName : "",
      lastName: profile.lastName ? profile.lastName : "",
      gender: profile.gender ? profile.gender : "",
      birthDate: profile.birthDate ? profile.birthDate : "",
      email: user.email ? user.email : "",
      phoneNumber: profile.phoneNumber ? profile.phoneNumber : "",
      address: profile.address ? profile.address : "",
      description: profile.description ? profile.description : "",
    });
  }, [
    profile.isSitter,
    profile.firstName,
    profile.lastName,
    profile.gender,
    profile.birthDate,
    user.email,
    profile.phoneNumber,
    profile.address,
    profile.description,
  ]);

  // Change 'Save' button from spinner back to normal when alert pops up
  useEffect(() => {
    setUpdatingProfileSpinner(false);
  }, [alerts]);

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
    let fullDate;
    if (birthDay > dayArray[dayArray.length - 1]) {
      setBirthDay(dayArray[dayArray.length - 1]);
      fullDate = new Date(dayArray[dayArray.length - 1], birthMonth, birthDay);
    }
    if (e.target.name === "birthDay") {
      setBirthDay(e.target.value);
      fullDate = new Date(birthYear, birthMonth, e.target.value);
    }
    if (e.target.name === "birthMonth") {
      setBirthMonth(e.target.value);
      fullDate = new Date(birthYear, e.target.value, birthDay);
    }
    if (e.target.name === "birthYear") {
      setBirthYear(e.target.value);
      fullDate = new Date(e.target.value, birthMonth, birthDay);
    }

    setAlert({ error: false, message: "" });
    const formattedDate = fullDate.toISOString().split("T")[0];

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
    setUpdatingProfileSpinner(true);
    e.preventDefault();
    if (!firstName) {
      setAlert({ error: true, message: "First Name is Required!" });
      return;
    }

    if (!lastName) {
      setAlert({ error: true, message: "Last Name is Required!" });
      return;
    }

    // Check whether the birth date input was incorrectly selected
    if (
      (!birthDay && birthMonth) ||
      (!birthDay && birthYear) ||
      (birthDay && birthMonth === "") ||
      (birthMonth === "" && birthYear) ||
      (!birthYear && birthMonth)
    ) {
      setAlert({ error: true, message: "Invalid Birth Date!" });
      return;
    }

    // Validation passed
    updateProfile(dispatch, profileData, profile._id);
  };
  return (
    <Grid container spacing={3} className={classes.formContainer}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center" className={classes.heading}>
          Edit Profile
        </Typography>
      </Grid>
      <Grid item sm={3} className={classes.vertAlign}>
        <Typography
          align={aboveSm ? "right" : "left"}
          className={classes.labelStyles}
        >
          I'M A SITTER
        </Typography>
      </Grid>
      <Grid item sm={9}>
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
      <Grid item xs={12} sm={3} className={classes.vertAlign}>
        <Typography
          align={aboveSm ? "right" : "left"}
          className={classes.labelStyles}
        >
          FIRST NAME
        </Typography>
      </Grid>
      <Grid item xs={12} sm={9}>
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
      <Grid item xs={12} sm={3} className={classes.vertAlign}>
        <Typography
          align={aboveSm ? "right" : "left"}
          className={classes.labelStyles}
        >
          LAST NAME
        </Typography>
      </Grid>
      <Grid item xs={12} sm={9}>
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
      <Grid item xs={12} sm={3} className={classes.vertAlign}>
        <Typography
          align={aboveSm ? "right" : "left"}
          className={classes.labelStyles}
        >
          GENDER
        </Typography>
      </Grid>
      <Grid item xs={12} sm={9}>
        <TextField
          select
          variant="outlined"
          name="gender"
          value={gender ? gender : ""}
          onChange={(e) => onChange(e)}
          className={classes.genderInput}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={3} className={classes.vertAlign}>
        <Typography
          align={aboveSm ? "right" : "left"}
          className={classes.labelStyles}
        >
          BIRTH DATE
        </Typography>
      </Grid>
      <Grid item xs={12} sm={9} className={classes.birthDateContainer}>
        <TextField
          select
          variant="outlined"
          name="birthMonth"
          label="Month"
          onChange={(e) => {
            handleBirthDateChange(e);
          }}
          value={birthMonth}
          className={classes.birthDateInput}
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
          className={classes.birthDateInput}
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
          className={classes.birthDateInput}
        >
          {yearMenuItem}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={3} className={classes.vertAlign}>
        <Typography
          align={aboveSm ? "right" : "left"}
          className={classes.labelStyles}
        >
          EMAIL ADDRESS
        </Typography>
      </Grid>
      <Grid item xs={12} sm={9}>
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
      <Grid item xs={12} sm={3} className={classes.vertAlign}>
        <Typography
          align={aboveSm ? "right" : "left"}
          className={classes.labelStyles}
        >
          PHONE NUMBER
        </Typography>
      </Grid>
      <Grid item xs={12} sm={9}>
        <TextField
          variant="outlined"
          name="phoneNumber"
          placeholder="Your Phone Number"
          fullWidth={true}
          value={phoneNumber}
          onChange={(e) => onChange(e)}
        />
      </Grid>
      <Grid item xs={12} sm={3} className={classes.vertAlign}>
        <Typography
          align={aboveSm ? "right" : "left"}
          className={classes.labelStyles}
        >
          WHERE YOU LIVE
        </Typography>
      </Grid>
      <Grid item xs={12} sm={9}>
        <TextField
          variant="outlined"
          name="address"
          placeholder="Address"
          fullWidth={true}
          value={address}
          onChange={(e) => onChange(e)}
        />
      </Grid>
      <Grid item xs={12} sm={3} className={classes.vertAlign}>
        <Typography
          align={aboveSm ? "right" : "left"}
          className={classes.labelStyles}
        >
          DESCRIBE YOURSELF
        </Typography>
      </Grid>
      <Grid item xs={12} sm={9}>
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
      <Grid item xs={12} sm={12} align="center">
        <Button
          disabled={!firstName || !lastName || !email}
          className={classes.saveButton}
          type="submit"
          variant="contained"
          size="large"
          color="primary"
          onClick={(e) => handleSubmit(e)}
        >
          {updatingProfileSpinner ? (
            <CircularProgress color="white" size={20} />
          ) : (
            `SAVE`
          )}
        </Button>
        <AlertMessage alert={alert} />
      </Grid>
    </Grid>
  );
}

export default EditProfileForm;

import React, { useContext } from "react";
import {
  Container,
  Grid,
  TextField,
  Typography,
  Button,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { UserContext } from "../../context/Context";

const useStyles = makeStyles(theme => ({
  search: {
    marginTop: theme.spacing(10),
  },
  searchInputs: {
    margin: theme.spacing(0),
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  heading: {
    fontWeight: "bold",
    marginBottom: "10px",
  },
  searchIcon: { color: "#f04040" },
  dateField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(0),
    width: 200,
  },
  textField: {
    fontWeight: "bold",
  },
}));
function SearchAndFilter() {
  const { filter, setFilter } = useContext(UserContext);

  const handleInput = e => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const classes = useStyles();
  return (
    <Container maxWidth="lg" className={classes.search}>
      <Typography
        component="h5"
        variant="h5"
        align="center"
        className={classes.heading}
      >
        Your search results
      </Typography>
      {/* Search buttons */}
      <div className={classes.searchInputs}>
        <Grid container spacing={2} justify="center" alignItems="flex-end">
          <Grid item>
            <SearchIcon className={classes.searchIcon} />
          </Grid>
          <Grid item>
            <TextField
              id="input-with-icon-grid"
              label="location"
              variant="standard"
              name="location"
              value={(filter && filter.location) || ""}
              onChange={e => handleInput(e)}
              className={classes.textField}
            />
          </Grid>
          <Grid item>
            <form className={classes.container} noValidate>
              <TextField
                id="date-picker-inline"
                label="Drop off"
                type="date"
                name="dropOff"
                value={(filter && filter.dropOff) || ""}
                onChange={e => handleInput(e)}
                className={classes.dateField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="date"
                label="Pickup"
                type="date"
                name="pickUp"
                value={(filter && filter.pickUp) || ""}
                onChange={e => handleInput(e)}
                className={classes.dateField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </Grid>
          {filter ? (
            <Grid item>
              <Button color="primary" onClick={() => setFilter("")}>
                Clear
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </div>
    </Container>
  );
}

export default SearchAndFilter;

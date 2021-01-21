import React from "react";

import { Container, Grid, TextField, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles();
  return (
    <Container maxWidth='lg' className={classes.search}>
      <Typography
        component='h5'
        variant='h5'
        align='center'
        style={{ fontWeight: "bold", marginBottom: "10px" }}
      >
        Your search results
      </Typography>
      {/* Search buttons */}
      <div className={classes.searchInputs}>
        <Grid container spacing={0} justify='center' alignItems='flex-end'>
          <Grid item>
            <SearchIcon style={{ color: "#f04040" }} />
          </Grid>
          <Grid item>
            <TextField
              id='input-with-icon-grid'
              label='location'
              variant='standard'
              className={classes.textField}
            />
          </Grid>
          <Grid item>
            <form className={classes.container} noValidate>
              <TextField
                id='date-picker-inline'
                label='Drop off'
                type='date'
                defaultValue='today'
                className={classes.dateField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id='date'
                label='Pickup'
                type='date'
                defaultValue='today'
                className={classes.dateField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}

export default SearchAndFilter;

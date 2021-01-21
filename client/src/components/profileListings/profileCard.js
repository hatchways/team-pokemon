import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core/";
import Rating from "@material-ui/lab/Rating";
import LocationOnIcon from "@material-ui/icons/LocationOn";

const useStyles = makeStyles((theme) => ({
  textField: {
    fontWeight: "450",
  },
  large: {
    marginTop: theme.spacing(2),
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  cardBottom: {
    display: "flex",
    direction: "row",
  },
  gridContainer: {
    marginTop: theme.spacing(5),
    paddingRight: theme.spacing(5),
    paddingLeft: theme.spacing(5),
  },
  cardContainer: {
    width: 300,
  },
}));

function ProductCard(props) {
  const classes = useStyles();
  //check for long descriptions and truncate it
  let description = props.description;
  if (description.length > 70) {
    description = description.substring(0, 67) + "...";
  }
  return (
    <Grid item align='center' className={classes.cardContainer}>
      <Card align='center' elevation={3}>
        <Avatar
          alt='Avatar'
          src={props.profilePicture}
          className={classes.large}
        />
        <CardContent>
          <Typography variant='h5' component='h5' className={classes.textField}>
            {props.firstName} {props.lastName}
          </Typography>
          <Typography
            gutterBottom
            variant='body2'
            color='textSecondary'
            component='p'
            className={classes.textField}
            style={{ height: "2vh" }}
          >
            Professional dog trainer.
          </Typography>
          <Rating
            name='read-only'
            value={props.rating}
            readOnly
            style={{ marginBottom: "2vh", height: "2vh" }}
          />
          <Typography
            gutterBottom
            variant='body1'
            component='p'
            style={{ height: "3.5vh" }}
            className={classes.textField}
          >
            {description}
          </Typography>
        </CardContent>
        <Grid
          container
          spacing={2}
          direction='row'
          justify='space-around'
          style={{ borderTop: "1px solid lightgrey", marginTop: "5px" }}
        >
          <Grid item style={{ margin: "5px" }}>
            <div className={classes.cardBottom}>
              <LocationOnIcon style={{ color: "f04040" }} />
              <Typography
                gutterBottom
                variant='body2'
                color='textSecondary'
                component='p'
                className={classes.textField}
              >
                Toronto, Ontario
              </Typography>
            </div>
          </Grid>
          <Grid item>
            <Typography
              gutterBottom
              variant='body1'
              component='p'
              className={classes.textField}
            >
              $14/hr
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}

export default ProductCard;

import React from "react";
import { Box, CardMedia, Typography, makeStyles } from "@material-ui/core";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import UserAvatar from "../../img/profilePhoto.jpg";
import Background from "../../img/background.jpg";
import Dogs from "../../img/dogs-main.jpg";

const useStyles = makeStyles(() => ({
  centerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  headerImage: { width: "100%", height: "300px", objectFit: "cover" },
  avatar: {
    height: "150px",
    width: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    transform: "translateY(-50%)",
    border: "5px solid white",
  },
  userName: {
    marginTop: "-75px",
    marginBottom: "15px",
    fontWeight: "bold",
  },
  userLocation: {
    display: "flex",
    alignItems: "center",
    fontSize: "15px",
    color: "grey",
    marginBottom: "50px",
  },
  locationIcon: { marginRight: "10px" },
  aboutMeContainer: { width: "90%", marginBottom: "30px" },
  aboutMeHeading: { marginBottom: "20px", fontWeight: "bold" },
  userImagesContainer: { flexWrap: "wrap", width: "90%", marginBottom: "40px" },
  userImages: {
    marginTop: "10px",
    marginRight: "10px",
    width: "100px",
    height: "100px",
    borderRadius: "10%",
  },
}));

function ProfileDetailCard() {
  const classes = useStyles();

  return (
    <Box className={classes.centerContent}>
      {/* Header Background Image */}
      <CardMedia image={Background} alt="bg" className={classes.headerImage} />
      {/* User's Profile Image */}
      <CardMedia image={UserAvatar} alt="header" className={classes.avatar} />
      {/* User's Name */}
      <Typography variant="h3" className={classes.userName}>
        Jane Doe
      </Typography>

      {/* User's Location */}
      <Typography className={classes.userLocation}>
        <LocationOnIcon color="primary" className={classes.locationIcon} />
        Toronto, Ontario
      </Typography>
      <Box className={classes.aboutMeContainer}>
        {/* About Me Section  */}
        <Typography variant="h5" className={classes.aboutMeHeading}>
          About me
        </Typography>
        <Typography>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et saepe
          porro voluptatibus maxime, quisquam natus expedita cupiditate! Amet
          consectetur nobis corrupti reprehenderit laudantium? Repellat animi
          rerum voluptatem doloribus, laudantium quis. Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Hic aspernatur, quia tempore sint
          ex cum explicabo, possimus saepe odit sed placeat porro atque
          consectetur quis quam voluptatum? Blanditiis, animi nulla.
        </Typography>
      </Box>
      {/* User's Uploaded Images */}
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.userImagesContainer}
      >
        <CardMedia image={Dogs} className={classes.userImages} />
        <CardMedia image={UserAvatar} className={classes.userImages} />
      </Box>
    </Box>
  );
}

export default ProfileDetailCard;

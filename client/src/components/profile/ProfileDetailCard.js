import React from "react";
import { Box, CardMedia, Typography, makeStyles } from "@material-ui/core";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DefaultAvatar from "../../img/profile-default.png";
import Background from "../../img/background.jpg";

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

function ProfileDetailCard({ profileDetails }) {
  const classes = useStyles();
  return (
    <Box className={classes.centerContent}>
      {/* Header Background Image */}
      <CardMedia
        image={
          profileDetails.headerPicture
            ? profileDetails.headerPicture
            : Background
        }
        alt="bg"
        className={classes.headerImage}
      />
      {/* User's Profile Image */}
      <CardMedia
        image={
          profileDetails.profilePicture
            ? profileDetails.profilePicture
            : DefaultAvatar
        }
        alt="avatar"
        className={classes.avatar}
      />
      {/* User's Name */}
      <Typography variant="h3" className={classes.userName}>
        {`${profileDetails.firstName} ${profileDetails.lastName}`}
      </Typography>

      {/* User's Location */}
      {profileDetails.address && (
        <Typography className={classes.userLocation}>
          <LocationOnIcon color="primary" className={classes.locationIcon} />
          {`${profileDetails.address}`}
        </Typography>
      )}
      {profileDetails.description && (
        <Box className={classes.aboutMeContainer}>
          {/* About Me Section  */}

          <Typography variant="h5" className={classes.aboutMeHeading}>
            About me
          </Typography>
          <Typography>{profileDetails.description}</Typography>
        </Box>
      )}
      {/* User's Uploaded Images */}
      {profileDetails && (
        <Box
          display="flex"
          justifyContent="flex-start"
          className={classes.userImagesContainer}
        >
          {profileDetails.photoAlbum &&
            profileDetails.photoAlbum.length > 0 &&
            profileDetails.photoAlbum.map((photo) => (
              <CardMedia
                key={photo}
                image={photo}
                className={classes.userImages}
              />
            ))}
        </Box>
      )}
    </Box>
  );
}

export default ProfileDetailCard;

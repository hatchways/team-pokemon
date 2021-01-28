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
        style={{
          width: "100%",
          height: "300px",
          objectFit: "cover",
          backgroundColor: "#e6e6e6",
        }}
      />
      {/* User's Profile Image */}
      <CardMedia
        image={
          profileDetails.profilePicture
            ? profileDetails.profilePicture
            : DefaultAvatar
        }
        alt="avatar"
        style={{
          height: "150px",
          width: "150px",
          borderRadius: "50%",
          objectFit: "cover",
          transform: "translateY(-50%)",
          border: "5px solid white",
        }}
      />
      {/* User's Name */}
      <Typography
        variant="h3"
        style={{
          marginTop: "-75px",
          marginBottom: "15px",
          fontWeight: "bold",
        }}
      >
        {`${profileDetails.firstName} ${profileDetails.lastName}`}
      </Typography>

      {/* User's Location */}
      {profileDetails.address && (
        <Typography
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "15px",
            color: "grey",
            marginBottom: "50px",
          }}
        >
          <LocationOnIcon color="primary" style={{ marginRight: "10px" }} />
          {`${profileDetails.address}`}
        </Typography>
      )}
      {profileDetails.description && (
        <Box style={{ width: "90%", marginBottom: "30px" }}>
          {/* About Me Section  */}

          <Typography
            variant="h5"
            style={{ marginBottom: "20px", fontWeight: "bold" }}
          >
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
          style={{ flexWrap: "wrap", width: "90%", marginBottom: "40px" }}
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

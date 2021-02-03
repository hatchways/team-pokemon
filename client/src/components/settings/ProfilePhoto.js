import React, { useCallback, useContext, useState } from "react";
import {
  Box,
  ButtonGroup,
  CardMedia,
  Grid,
  Typography,
  Button,
  Hidden,
  RootRef,
  Paper,
  Avatar,
  CircularProgress,
  useMediaQuery,
  Card,
} from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import base64url from "base64url";
import axios from "axios";
import { makeStyles } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {
  AuthStateContext,
  AuthDispatchContext,
} from "../../context/AuthContext";
import defaultPicture from "../../img/profile-default.png";
import { getUser } from "../../actions/auth";
import { setPhotoCategory } from "../../actions/profile";


const useStyles = makeStyles((theme) => ({
  root: { flexgrow: 1 },
  dropzone: {
    height: "70%",
    margin: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    outline: "none",
    cursor: "pointer",
    textAlign: "center",
    border: "2px dashed #e8dbda",
  },
  active: {
    height: "70%",
    margin: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    outline: "none",
    cursor: "pointer",
    textAlign: "center",
    border: "2px dashed #bfb5b4",
    backgroundColor: "#e8dbda",
  },
  large: {
    width: theme.spacing(24),
    height: theme.spacing(24),
  },
  loading: {
    position: "absolute",
    top: "75%",
    left: "50%",
    marginLeft: "-20px",
    marginTop: "-20px",
  },
  headingSpacing: {
    marginTop: "30px",
  },
  headingStyles: { fontWeight: "bold", marginBottom: "20px" },
  headerPicture: {
    width: "90%",
    height: "220px",
    position: "absolute",
    transform: "translateX(5%)",
    backgroundColor: "#e6e6e6",
    borderRadius: "5px",
  },
  profilePicture: {
    margin: "auto",
    border: "5px solid white",
    transform: "translateY(25%)",
  },
  userImages: {
    marginTop: "10px",
    marginRight: "10px",
    width: "100px",
    height: "100px",
    borderRadius: "10%",
  },
  selectedImage: {
    border: "5px solid #f04040",
  },
  buttonsBreakpoint: {
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  gridContainer: {
    marginBottom: "50px",
  },
  albumContainer: {
    width: "100%",
    padding: "30px",
    boxSizing: "border-box",
  },
  mainPicturePositioning: { position: "relative", width: "100%" },
  uploadSectionPositioning: {
    width: "80%",
    height: "200px",
    marginTop: "50px",
  },
  uploadSectionPositioningMobile: {
    width: "70%",
    margin: "30px auto",
  },
  infoTextSpacing: { margin: "10px" },
  albumTitle: { fontSize: "20px", fontWeight: "bold" },
  photoAlbumStyles: { flexWrap: "wrap", marginBottom: "40px" },
}));

function ProfilePhoto() {
  //
  //ADD LOADING
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const { profile } = useContext(AuthStateContext);
  const dispatch = useContext(AuthDispatchContext);

  const aboveSm = useMediaQuery("(min-width:600px)");

  // picture chosen

  const onDrop = useCallback(async (acceptedFiles) => {
    setLoading(true);
    const url = `/api/profile/upload/${profile._id}`;
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    await axios.post(url, formData);
    getUser(dispatch);
    setLoading(false);
  }, []);

  //configure DropZone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accepts: "image/*",
    multiple: false,
  });
  const { ref, ...rootProps } = getRootProps();

  const classes = useStyles();

  //delete picture
  const handleDelete = async () => {
    setLoading(true);
    const url = `/api/profile/delete/${profile._id}/${base64url(
      selectedPhoto
    )}`;
    await axios.delete(url);
    getUser(dispatch);
    setSelectedPhoto("");
    setLoading(false);
  };

  // Set profile/header photo

  const handleSetAsProfilePhoto = (category) => {
    const payload = {
      photoUrl: selectedPhoto,
      category,
    };
    setPhotoCategory(dispatch, payload, profile._id);
  };

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.gridContainer}
    >
      <Grid item className={classes.headingSpacing}>
        <Typography
          variant="h4"
          align="center"
          className={classes.headingStyles}
        >
          Photos
        </Typography>
      </Grid>
      <Grid item className={classes.mainPicturePositioning}>
        <CardMedia
          image={profile && profile.headerPicture && profile.headerPicture}
          className={classes.headerPicture}
        />
        <Avatar
          alt="user"
          src={
            profile && profile.profilePicture
              ? profile.profilePicture
              : defaultPicture
          }
          className={classes.large + " " + classes.profilePicture}
        />
        {loading && <CircularProgress size={40} className={classes.loading} />}
      </Grid>
      <Hidden xsDown>
        <Grid item className={classes.uploadSectionPositioning}>
          <RootRef rootRef={ref}>
            <Paper
              {...rootProps}
              elevation={0}
              className={isDragActive ? classes.active : classes.dropzone}
            >
              <input {...getInputProps()} />
              <p className={classes.infoTextSpacing}>
                Drag file here, or click to select file
              </p>
            </Paper>
          </RootRef>
        </Grid>
      </Hidden>
      <Hidden smUp>
        <Grid item className={classes.uploadSectionPositioningMobile}>
          <RootRef rootRef={ref}>
            <Paper
              {...rootProps}
              elevation={0}
              className={isDragActive ? classes.active : classes.dropzone}
            >
              <input {...getInputProps()} />
              <p className={classes.infoTextSpacing}>
                Drag file here, or click to select file
              </p>
            </Paper>
          </RootRef>
        </Grid>
      </Hidden>
      <Box className={classes.albumContainer}>
        <Box
          display="flex"
          justifyContent="space-between"
          className={classes.buttonsBreakpoint}
        >
          {profile.photoAlbum && profile.photoAlbum.length > 0 && (
            <Typography className={classes.albumTitle}>Your Photos</Typography>
          )}
          {selectedPhoto !== "" && (
            <ButtonGroup orientation={aboveSm ? "horizontal" : "vertical"}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleSetAsProfilePhoto("profile")}
              >
                Set As Profile Photo
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSetAsProfilePhoto("header")}
              >
                Set As Header Photo
              </Button>
              <Button
                color="primary"
                variant="outlined"
                startIcon={<DeleteForeverIcon />}
                onClick={handleDelete}
              >
                Delete photo
              </Button>
            </ButtonGroup>
          )}
        </Box>
        <Box display="flex" className={classes.photoAlbumStyles}>
          {profile &&
            profile.photoAlbum &&
            profile.photoAlbum.map((photo) => (
              <CardMedia
                key={photo}
                image={photo}
                onClick={() => {
                  if (selectedPhoto === photo) {
                    setSelectedPhoto("");
                  } else {
                    setSelectedPhoto(photo);
                  }
                }}
                className={
                  photo === selectedPhoto
                    ? classes.userImages + " " + classes.selectedImage
                    : classes.userImages
                }
              />
            ))}
        </Box>
      </Box>
    </Grid>
  );
}

export default ProfilePhoto;

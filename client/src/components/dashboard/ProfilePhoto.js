import React, { useCallback, useContext, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Hidden,
  RootRef,
  Paper,
  Avatar,
  CircularProgress,
} from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { makeStyles } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {
  AuthStateContext,
  AuthDispatchContext,
} from "../../context/AuthContext";
import defaultPicture from "../../img/profile-default.png";
import { getUser } from "../../actions/auth";

const useStyles = makeStyles(theme => ({
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
    top: "50%",
    left: "50%",
    marginLeft: "-20px",
    marginTop: "-20px",
  },
}));

function ProfilePhoto() {
  //
  //ADD LOADING
  const [loading, setLoading] = useState(false);
  const { profile } = useContext(AuthStateContext);
  const dispatch = useContext(AuthDispatchContext);

  //picture chosen
  const onDrop = useCallback(async acceptedFiles => {
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
    const url = `/api/profile/delete/${profile._id}`;
    await axios.delete(url);
    getUser(dispatch);
    setLoading(false);
  };

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item style={{ marginTop: "30px" }}>
        <Typography
          variant="h4"
          align="center"
          style={{ fontWeight: "bold", marginBottom: "20px" }}
        >
          Profile Photo
        </Typography>
      </Grid>
      <Grid item style={{ position: "relative" }}>
        <Avatar
          alt="user"
          src={
            profile && profile.profilePicture
              ? profile.profilePicture
              : defaultPicture
          }
          className={classes.large}
        />
        {loading && <CircularProgress size={40} className={classes.loading} />}
      </Grid>
      <Hidden xsDown>
        <Grid
          item
          style={{
            width: "80%",
            height: "200px",
            marginTop: "30px",
          }}
        >
          <RootRef rootRef={ref}>
            <Paper
              {...rootProps}
              elevation={0}
              className={isDragActive ? classes.active : classes.dropzone}
            >
              <input {...getInputProps()} />
              <p style={{ margin: "10px" }}>
                Drag file here, or click to select file
              </p>
            </Paper>
          </RootRef>
        </Grid>
      </Hidden>
      <Hidden smUp>
        <Grid
          item
          style={{
            width: "70%",
            margin: "30px auto",
          }}
        >
          <RootRef rootRef={ref}>
            <Paper
              {...rootProps}
              elevation={0}
              className={isDragActive ? classes.active : classes.dropzone}
            >
              <input {...getInputProps()} />
              <p style={{ margin: "10px" }}>
                Drag file here, or click to select file
              </p>
            </Paper>
          </RootRef>
        </Grid>
      </Hidden>
      <Grid item style={{ marginTop: "20px", marginBottom: "30px" }}>
        <Button
          color="primary"
          variant="outlined"
          startIcon={<DeleteForeverIcon />}
          onClick={handleDelete}
        >
          Delete photo
        </Button>
      </Grid>
    </Grid>
  );
}

export default ProfilePhoto;

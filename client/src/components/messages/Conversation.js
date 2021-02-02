import React, { useState, useEffect, useContext } from "react";
import { Grid, makeStyles, Typography, Avatar, Box } from "@material-ui/core";
import defaultPicture from "../../img/profile-default.png";
import moment from "moment";
import { UserContext } from "../../context/Context";

moment.locale("en", {
  calendar: {
    lastDay: "[Yesterday]",
    sameDay: "LT",
    lastWeek: "dddd",
    sameElse: "L",
  },
});

const useStyles = makeStyles(theme => ({
  dialogsBox: {
    height: "100%",
    borderRight: "1px solid lightgray",
  },
  dialogsHeader: {
    marginTop: "10px",
    padding: "20px",
    textAlign: "center",
    width: "100%",
    borderBottom: "1px solid lightgray",
  },
  dialogPreview: {
    height: "auto",
    width: "100%",
    display: "flex",
    padding: "5px",
    paddingTop: "15px",
    paddingBottom: "15px",
    borderBottom: "1px solid lightgray",
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  previewText: {
    height: "100%",
    marginLeft: "15px",
  },
  messagePreview: {
    color: "gray",
  },
  messageTime: {
    marginLeft: "auto",
  },
  noDialogs: {
    color: "gray",
    margin: "auto",
  },
  link: {
    textDecoration: "none",
    width: "100%",
    color: "black",
    transition: ".1s",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.05)",
    },
  },
}));

function Conversation(props) {
  const { setChatUserData, setMobileMessageView } = useContext(UserContext);
  const [conversations, setConversations] = useState([]);
  const classes = useStyles();
  //setLoading

  useEffect(() => {
    setConversations(props.conversations);
    // setChatUserData();
    console.log("SHOULD DROP CHAT user data");
  }, [props]);

  //API call to get all the conversations from backend +
  //should also add their id so to add link (around avatar)
  //can change "Yesterday, Sunday, etc as message time on backend +

  const showMessages = e => {
    setMobileMessageView(true);
    setChatUserData(e);
  };

  return (
    <Grid
      container
      justify="flex-start"
      alignItems="center"
      direction="column"
      className={classes.dialogsBox}
    >
      <Grid item className={classes.dialogsHeader}>
        <Typography variant="h5">Your dialogues</Typography>
      </Grid>
      {conversations &&
        conversations.map((dialog, index) => {
          return (
            <Box
              className={classes.link}
              onClick={e => showMessages(dialog)}
              key={index}
            >
              <Grid item className={classes.dialogPreview}>
                <Avatar
                  src={
                    dialog && dialog.picture ? dialog.picture : defaultPicture
                  }
                  className={classes.avatar}
                />
                <Box className={classes.previewText}>
                  <Typography variant="h6">
                    {dialog.firstName + " " + dialog.lastName}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className={classes.messagePreview}
                  >
                    {dialog.lastMessage
                      ? dialog.lastMessage.content.toString().length > 18
                        ? dialog.lastMessage.content.slice(0, 18) + "..."
                        : dialog.lastMessage.content
                      : null}
                  </Typography>
                </Box>
                <Typography className={classes.messageTime}>
                  {dialog.lastMessage &&
                    moment(dialog.lastMessage.timeCreated).calendar()}
                </Typography>
              </Grid>
            </Box>
          );
        })}
      {!conversations || conversations.length === 0 ? (
        <Typography variant="subtitle1" className={classes.noDialogs}>
          You have no dialogs yet...
        </Typography>
      ) : null}
    </Grid>
  );
}

export default Conversation;

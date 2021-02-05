import React, { useState, useEffect, useContext } from "react";
import { Grid, makeStyles, Typography, Avatar, Box } from "@material-ui/core";
import defaultPicture from "../../img/profile-default.png";
import moment from "moment";
import { UserContext } from "../../context/Context";
import { AuthStateContext } from "../../context/AuthContext";

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
  const {
    socket,
    chatUserData,
    setChatUserData,
    setMobileMessageView,
  } = useContext(UserContext);
  const { user } = useContext(AuthStateContext);
  const [conversations, setConversations] = useState([]);
  const [lastMessage, setLastMessage] = useState();
  const classes = useStyles();

  useEffect(() => {
    setConversations(props.conversations);
  }, [props]);

  useEffect(() => {
    //join room for this user
    const data = {
      userId: user._id,
    };
    socket && socket.emit("join", { data }, () => {});

    //clean socket before destroying component
    return () => {
      socket && socket.off();
    };
  }, [socket]);

  useEffect(() => {
    socket &&
      socket.on("newMessage", data => {
        const newMessage = {
          sender: data.sender,
          content: data.content,
          timeCreated: data.timeCreated,
          chatId: data.chatId,
          wasRead: data.wasRead,
        };
        setLastMessage(newMessage);
        conversations &&
          conversations.map(dialog => {
            return dialog.chatId === newMessage.chatId
              ? (dialog.lastMessage = newMessage)
              : null;
          });
      });
  }, [chatUserData]);

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
                    {lastMessage && lastMessage.chatId === dialog.chatId
                      ? lastMessage.content.toString().length > 18
                        ? lastMessage.content.slice(0, 18) + "..."
                        : lastMessage.content
                      : dialog.lastMessage.content
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

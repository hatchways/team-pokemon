import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Grid,
  makeStyles,
  TextField,
  Button,
  Typography,
  Avatar,
  Box,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import { UserContext } from "../../context/Context";
import defaultPicture from "../../img/profile-default.png";

const useStyles = makeStyles(theme => ({
  messagesBox: {
    height: "100%",
  },
  headerBox: {
    height: "15%",
    padding: "10px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: "20px",
    marginLeft: "20px",
  },
  messageList: {
    height: "65%",
    borderBottom: "1px solid lightgray ",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflowY: "auto",
  },
  message: {
    borderRadius: "8px",
    width: "fit-content",
    maxWidth: "80%",
    padding: "8px",
    margin: "8px",
    boxShadow: "0px 0px 9px 1px rgba(0,0,0,0.2)",
  },
  myMessage: {
    backgroundColor: "white",
    marginLeft: "auto",
  },
  theirMessage: {
    backgroundColor: "#e3e4e6",
  },
  theirMessageWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  theirMessageAvatar: {
    margin: "10px",
  },
  messageText: {
    fontSize: "16px",
  },
  inputBox: {
    height: "20%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "80%",
    margin: "10px",
  },
  sendButton: {
    margin: "auto",
  },
  chooseHintBox: {
    height: "100%",
  },
  chooseHint: {
    color: "gray",
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: "-30px",
    marginTop: "-30px",
  },
}));

function Message() {
  const { chatUserData } = useContext(UserContext);
  const [messageHistory, setMessageHistory] = useState();
  const [messageContent, setMessageContent] = useState("");
  const classes = useStyles();
  const lastMessageRef = useRef(null);

  useEffect(() => {
    chatUserData && getMessageHistory();
    return () => {
      setMessageHistory();
    };
  }, [chatUserData]);

  const getMessageHistory = async () => {
    let resp = await axios.post("/api/chat/history", {
      chatId: chatUserData.chatId,
    });
    setMessageHistory(resp.data.messages);
    lastMessageRef.current?.scrollIntoView();
  };

  const sendMessage = async e => {
    e.preventDefault();
    await axios.post("/api/chat/message", {
      content: messageContent,
      chatId: chatUserData.chatId,
    });
  };

  return (
    <>
      {chatUserData ? (
        <Grid container direction="column" className={classes.messagesBox}>
          <Grid item className={classes.headerBox}>
            <Avatar
              src={chatUserData.picture || defaultPicture}
              className={classes.avatar}
            />
            <Typography variant="h6">
              {chatUserData.firstName + " " + chatUserData.lastName}
            </Typography>
          </Grid>
          <Grid item className={classes.messageList}>
            {messageHistory ? (
              messageHistory.map((message, index) => {
                return (
                  <Box
                    className={classes.theirMessageWrapper}
                    key={index}
                    ref={
                      index === messageHistory.length - 1
                        ? lastMessageRef
                        : null
                    }
                  >
                    {chatUserData.userId === message.sender ? (
                      <Avatar
                        src={chatUserData.picture || defaultPicture}
                        className={classes.theirMessageAvatar}
                      />
                    ) : null}
                    <Box
                      className={
                        classes.message +
                        " " +
                        (chatUserData.userId === message.sender
                          ? classes.theirMessage
                          : classes.myMessage)
                      }
                    >
                      <Typography className={classes.messageText}>
                        {message.content}
                      </Typography>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <CircularProgress size={60} className={classes.loading} />
            )}
          </Grid>
          <Grid item className={classes.inputBox}>
            <TextField
              multiline
              rows={4}
              InputProps={{ disableUnderline: true }}
              className={classes.textInput}
              onChange={e => setMessageContent(e.target.value)}
              placeholder={"Reply to " + chatUserData.firstName}
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.sendButton}
              onClick={sendMessage}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          justify="center"
          alignItems="center"
          className={classes.chooseHintBox}
        >
          <Typography variant="h6" className={classes.chooseHint}>
            Choose dialogue from the list...
          </Typography>
        </Grid>
      )}
    </>
  );
}

export default Message;

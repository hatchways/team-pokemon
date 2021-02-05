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
  Dialog,
  IconButton,
} from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import axios from "axios";
import moment from "moment";
import { UserContext } from "../../context/Context";
import { AuthStateContext } from "../../context/AuthContext";
import defaultPicture from "../../img/profile-default.png";
import { Link } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

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
    borderBottom: "1px solid lightgray ",
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
    padding: "5px",
  },
  textInput: {
    width: "80%",
    margin: "10px",
  },
  sendButton: {
    margin: "auto",
  },
  chooseHint: {
    marginTop: "48%",
    color: "gray",
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: "-30px",
    marginTop: "-30px",
  },
  backButton: {
    zIndex: "100",
  },
}));

function MobileMessage(props) {
  const { user } = useContext(AuthStateContext);
  const {
    chatUserData,
    mobileMessageView,
    setMobileMessageView,
    socket,
  } = useContext(UserContext);
  const [messageHistory, setMessageHistory] = useState();
  const [messageContent, setMessageContent] = useState("");
  const [message, setMessage] = useState();
  const lastMessageRef = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    chatUserData && getMessageHistory();
    return () => {
      setMessageHistory();
    };
  }, [chatUserData]);

  useEffect(() => {
    //join room for this conversation
    if (chatUserData) {
      const data = {
        userId: user._id,
        chatId: chatUserData.chatId,
      };
      socket && socket.emit("join", { data }, () => {});
    }
    //clean socket before destroying component
    return () => {
      socket && socket.off();
    };
  }, [chatUserData, socket]);

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
        setMessage(newMessage);
      });
  }, [chatUserData]);

  useEffect(() => {
    if (
      messageHistory &&
      message &&
      messageHistory[0].chatId === message.chatId
    ) {
      setMessageContent("");
      let updatedHistory = messageHistory && [...messageHistory, message];
      setMessageHistory(updatedHistory);
    }
    return;
  }, [message]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView();
  }, [messageHistory]);

  const getMessageHistory = async () => {
    let resp = await axios.post("/api/chat/history", {
      chatId: chatUserData.chatId,
    });
    setMessageHistory(resp.data.messages);
    lastMessageRef.current?.scrollIntoView();
  };

  const sendMessage = async e => {
    socket.emit("message", {
      sender: user._id,
      content: messageContent,
      timeCreated: moment().format(),
      chatId: chatUserData.chatId,
      wasRead: false,
    });

    e.preventDefault();
    await axios.post("/api/chat/message", {
      content: messageContent,
      chatId: chatUserData.chatId,
    });
  };

  return (
    <Dialog
      open={mobileMessageView}
      fullScreen
      TransitionComponent={Transition}
      onEnter={() => {
        setMessageHistory();
        getMessageHistory();
      }}
    >
      {chatUserData ? (
        <Grid container direction="column" className={classes.messagesBox}>
          <Grid item className={classes.headerBox}>
            <Link to="/chat">
              <IconButton
                aria-label="close"
                color="primary"
                className={classes.backButton}
                size="medium"
                onClick={() => setMobileMessageView(false)}
              >
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <Avatar
              src={chatUserData.picture || defaultPicture}
              className={classes.avatar}
            />
            <Typography variant="h6">
              {chatUserData.firstName + " " + chatUserData.lastName}
            </Typography>
          </Grid>
          <Grid item className={classes.messageList} id="messageList">
            {messageHistory ? (
              messageHistory.map((message, index) => {
                return (
                  <Box key={index}>
                    {message.content ? (
                      <Box
                        className={classes.theirMessageWrapper}
                        // ref={
                        //   index === messageHistory.length - 1
                        //     ? lastMessageRef
                        //     : null
                        // }
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
                    ) : null}
                  </Box>
                );
              })
            ) : (
              <CircularProgress size={60} className={classes.loading} />
            )}
            <Box ref={lastMessageRef}></Box>
          </Grid>
          <Grid item className={classes.inputBox}>
            <TextField
              multiline
              rows={4}
              InputProps={{ disableUnderline: true }}
              className={classes.textInput}
              onChange={e => setMessageContent(e.target.value)}
              value={messageContent || ""}
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
      ) : null}
    </Dialog>
  );
}

export default MobileMessage;

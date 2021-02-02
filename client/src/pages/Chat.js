import React, { useState, useEffect } from "react";
import { Grid, makeStyles, Hidden, Typography } from "@material-ui/core";
import Conversation from "../components/messages/Conversation";
import Message from "../components/messages/Message";
import MobileMessage from "../components/messages/MobileMessage";
import axios from "axios";

const useStyles = makeStyles(theme => ({
  chatBox: {
    height: "100vh",
    paddingTop: "55px",
  },
}));

function Chat() {
  const [conversations, setConversations] = useState();
  const classes = useStyles();

  useEffect(() => {
    getChats();
  }, []);

  const getChats = async () => {
    let resp = await axios.get("/api/chat");
    setConversations(resp.data.data);
  };

  return (
    <Grid container className={classes.chatBox}>
      <Grid item lg={3} md={4} sm={5} xs={12} className={classes.dialogsList}>
        <Conversation conversations={conversations && conversations} />
      </Grid>
      <Hidden xsDown>
        <Grid item lg={9} md={8} sm={7}>
          <Message />
        </Grid>
      </Hidden>
      <Hidden smUp>
        <MobileMessage />
      </Hidden>
    </Grid>
  );
}

export default Chat;

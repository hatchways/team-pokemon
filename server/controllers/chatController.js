const mongoose = require("mongoose");
const createError = require("http-errors");
const moment = require("moment");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const Profile = require("../models/profileModel");
const User = require("../models/userModel");

exports.createChat = async (req, res, next) => {
  try {
    Chat.findOne(
      {
        participants: ["6015f112ed9e414aa003c32a", req.user.id], //1st PARTICIPANT - should come form body.req!!
      },
      async (err, chat) => {
        if (err) console.log(err);
        if (chat) {
          return;
          //If user is going to message other user we check if they have chatted already and if so - send message history as response
        }
        if (!chat) {
          const newMessage = new Message({
            timeCreated: moment(),
          });
          newMessage.save();

          let newChat = new Chat({
            participants: ["6015f112ed9e414aa003c32a", req.user.id], //1st PARTICIPANT - should come form body.req!!
            messages: [newMessage._id],
          });
          newChat.save();
        }
      }
    );
  } catch (err) {
    next(createError(500, err.message));
  }
};

exports.getChats = async (req, res, next) => {
  //Look for all chats with req.user.id; Check conversation's last message; Find other party's profile; Combine all together;

  //Retrieve all chats where user is listed as participant
  try {
    Chat.find(
      {
        participants: { $all: [req.user.id] },
      },
      async (err, chats) => {
        if (err) console.log(err);
        //get id of companion, id of conversation and last message
        let messageData = await Promise.all(
          chats.map(async chat => {
            return {
              chatId: chat._id,
              companionUserData: await User.findById(
                chat.participants.filter(participant => {
                  return participant !== req.user.id;
                })[0]
              ),
              lastMessage: await Message.findById(
                chat.messages[chat.messages.length - 1]
              ),
            };
          })
        );
        //get companion profile data
        let conversations = await Promise.all(
          messageData.map(async item => {
            let profile = await Profile.findById(
              item.companionUserData.profile
            );
            return {
              firstName: profile.firstName,
              lastName: profile.lastName,
              picture: profile.profilePicture,
              profileId: profile._id,
              userId: item.companionUserData._id,
              lastMessage: item.lastMessage,
              chatId: item.chatId,
            };
          })
        );
        //sort chats the way latest message will be on top, and chats with no messages will be at the bottom
        conversations.sort((a, b) => {
          if (a.lastMessage) {
            if (b.lastMessage) {
              if (a.lastMessage.timeCreated > b.lastMessage.timeCreated) {
                return -1;
              } else {
                return 1;
              }
            } else {
              if (a.lastMessage.timeCreated > 0) {
                return -1;
              }
            }
          } else if (!a.lastMessage && !b.lastMessage) {
            if (a.chatId > b.chatId) {
              return -1;
            }
          }
        });
        res.json({ error: false, data: conversations });
      }
    );
  } catch (err) {
    next(createError(500, err.message));
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { content, chatId } = req.body;
    const sender = req.user.id;
    Chat.findById(chatId, (err, chat) => {
      if (err) console.log(err);
      const newMessage = new Message({
        sender: sender,
        content: content,
        timeCreated: moment().format(),
        wasRead: false,
        chatId: chat._id,
      });
      newMessage.save();
      chat.messages = [...chat.messages, newMessage._id];
      chat.save();
      res.json({ error: false, message: "Message was delivered" });
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

exports.historyOfMessages = async (req, res, next) => {
  try {
    const { chatId } = req.body;
    let messages = await Chat.findById(chatId).populate("messages");
    res.json({ error: false, messages: messages.messages });
  } catch (err) {
    next(createError(500, err.message));
  }
};

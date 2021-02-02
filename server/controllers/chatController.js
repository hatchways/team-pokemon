const mongoose = require("mongoose");
const createError = require("http-errors");
const moment = require("moment");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const Profile = require("../models/profileModel");
const User = require("../models/userModel");

// exports.createChat = async (req, res) => {
//   //Checking if chat exists
//   Chat.findOne(
//     {
//       //CHANGE SITTER AND OWNER
//       participants: { sitter: "60130ed95608d677a482c9d5", owner: req.user.id }, //!order has to match model (sitter first, owner second)
//     },
//     async (err, chat) => {
//       if (err) console.log(err);
//       if (chat) {
//         return console.log("CHAT EXISTS");
//       }
//       if (!chat) {
//         console.log("CREATE A CHAT");
//         const newMessage = new Message({
//           time_created: new Date(),
//         });
//         await newMessage.save();

//         let newChat = new Chat({
//           participants: {
//             sitter: "60130ed95608d677a482c9d5", //CHANGE SITTER HERE
//             owner: req.user.id, //CHANGE OWNER HERE
//           },
//           messages: newMessage,
//         });
//         newChat.save();
//         console.log(newChat);
//       }
//     }
//   );
// };

// //THIS IS RATHER A SEND MESSAGE (THAN openChat)
// exports.openChat = async (req, res) => {
//   console.log(req.body);
//   console.log(req.user.id);
//   let chat = await Chat.findOne({
//     //CHANGE SITTER AND OWNER
//     participants: { sitter: "60130ed95608d677a482c9d5", owner: req.user.id },
//   });
//   //console.log(chat.messages);
//   Message.findById(chat.messages, async (err, msg) => {
//     if (err) console.log(err);
//     msg.messages.push({
//       content: req.body.content,
//       sender: req.body.sender,
//       wasRead: false,
//       time_created: new Date(),
//       chatId: chat._id,
//     });
//     await msg.save();
//     console.log(msg);
//   });
// };
// //Based on SocketIO events - change state of message from unread to read
// exports.messageRead = async (req, res) => {
//   let chat = await Chat.findOne({
//     //CHANGE SITTER AND OWNER
//     participants: { sitter: "60130ed95608d677a482c9d5", owner: req.user.id },
//   });
//   Message.findById(chat.messages, async (err, msg) => {
//     if (err) console.log(err);
//     //msg is an array of messages

//     //msg.map (sender!=req.user.id  and  wasRead==false  and  whatever we are reflecting, lets say only 20 messages )
//     //on scroll up - another 20 messages should download

//     // msg.messages.push({
//     //   content: req.body.content,
//     //   sender: req.body.sender,
//     //   wasRead: false,
//     //   time_created: new Date(),
//     //   chatId: chat._id,
//     // });
//     // await msg.save();
//     // console.log(msg);
//   });
// };

exports.createChat = async (req, res, next) => {
  Chat.findOne(
    {
      participants: ["601851731532dd4f585fced2", req.user.id], //1st PARTICIPANT - should come form body.req!!
    },
    async (err, chat) => {
      if (err) console.log(err);
      if (chat) {
        return;
      }
      if (!chat) {
        const newMessage = new Message({
          timeCreated: moment(),
        });
        await newMessage.save();

        let newChat = new Chat({
          participants: ["601851731532dd4f585fced2", req.user.id], //1st PARTICIPANT - should come form body.req!!
          messages: newMessage,
        });
        newChat.save();
      }
    }
  );
};
//router.get /chat
exports.getChats = async (req, res, next) => {
  //We first look for all chats where req.user.id is listed; We then find other party's profile info (name, picture)
  //Next, we check their conversation's last message and finally combine all the pieces of data together
  //Retrieve all chats were user is listed as participant
  try {
    await Chat.find(
      {
        participants: { $all: [req.user.id] },
      },
      async (err, chats) => {
        if (err) console.log(err);
        //get id of companion and their conversation
        let messageIds = chats.map(chat => {
          return {
            chatId: chat._id,
            companionUserId: chat.participants.filter(participant => {
              return participant !== req.user.id;
            })[0],
            messageId: mongoose.Types.ObjectId(chat.messages),
          };
        });
        //add last message to reflect on FE
        let lastMessage = await Message.aggregate([
          {
            $match: {
              _id: {
                $in: messageIds.map(item => {
                  return item.messageId;
                }),
              },
            },
          },
          {
            $group: {
              _id: {
                messages: "$messages",
                messagesId: "$_id",
              },
            },
          },
        ]);
        const lastMessagesList = messageIds.map(item => {
          return {
            chatId: item.chatId.toString(),
            companionUserId: item.companionUserId,
            messageId: item.messageId.toString(),
            lastMessage: lastMessage
              .filter(element => {
                return (
                  element._id.messagesId.toString() ===
                  item.messageId.toString()
                );
              })[0]
              ._id.messages.slice(-1)[0],
          };
        });

        //get list of all conversations
        let companions = chats
          .map(chat => {
            return chat.participants.filter(participant => {
              return participant !== req.user.id;
            });
          })
          .flat();
        //find Profile Id for every companion
        const userIds = companions.map(id => {
          return mongoose.Types.ObjectId(id);
        });
        let userProfiles = await User.aggregate([
          { $match: { _id: { $in: userIds } } },
          { $group: { _id: { profileId: "$profile", userId: "$_id" } } },
        ]);
        //find Profile Data for every companion
        const profileIds = userProfiles.map(item => {
          return mongoose.Types.ObjectId(item._id.profileId);
        });
        let profilesData = await Profile.aggregate([
          { $match: { _id: { $in: profileIds } } },
          {
            $group: {
              _id: {
                firstName: "$firstName",
                lastName: "$lastName",
                profile: "$_id",
                picture: "$profilePicture",
              },
            },
          },
        ]);
        //Bring all the data together and create array of objects
        let conversations = profilesData.map(item => {
          return {
            // chatId: ,
            firstName: item._id.firstName,
            lastName: item._id.lastName,
            picture: item._id.picture,
            profileId: item._id.profile,
            userId: userProfiles.filter(element => {
              return (
                element._id.profileId.toString() == item._id.profile.toString()
              );
            })[0]._id.userId,
          };
        });
        conversations.map(item => {
          item.lastMessage = lastMessagesList.filter(element => {
            return (
              element.companionUserId.toString() === item.userId.toString()
            );
          })[0].lastMessage;
          item.chatId = lastMessagesList.filter(element => {
            return (
              element.companionUserId.toString() === item.userId.toString()
            );
          })[0].chatId;
        });
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

//Send a message
exports.sendMessage = async (req, res, next) => {
  const { content, chatId } = req.body;
  const sender = req.user.id;
  await Chat.findById(chatId, async (err, chat) => {
    if (err) console.log(err);
    console.log(chat);
    messageId = chat.messages;
    Message.findById(messageId, (err, messages) => {
      if (err) console.log(err);
      messages.messages.push({
        sender: sender,
        content: content,
        timeCreated: moment().format(),
        wasRead: false,
        chatId: chat._id,
      });
      messages.save();
      console.log(messages);
      res.json({ error: false, message: "Message was delivered" });
    });
  });
};

exports.historyOfMessages = async (req, res, next) => {
  try {
    const { chatId } = req.body;
    await Chat.findById(chatId, async (err, chat) => {
      if (err) console.log(err);
      await Message.findById(chat.messages, (err, messages) => {
        if (err) console.log(err);
        res.json({ error: false, messages: messages.messages });
      });
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

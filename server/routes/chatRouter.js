const router = require("express").Router();

const chatController = require("../controllers/chatController");
const verifyToken = require("../middleware/verifyToken");
//const Message = require("../models/messageModel");
//const Chat = require("../models/chatModel");

router.use(verifyToken);

router.get("/", chatController.getChats); //load chats when user opens thei chats on FE
router.post("/", chatController.createChat); //chat is created when sitter accepts request //ROUTE SHOULD BE CHANGED
router.post("/message", chatController.sendMessage); //when user clicks "Messages" in the navbar  //IT WAS OPEN CHAT
router.post("/history", chatController.historyOfMessages); //load all previous messages for chat

module.exports = router;

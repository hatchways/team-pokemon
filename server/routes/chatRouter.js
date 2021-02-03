const router = require("express").Router();

const chatController = require("../controllers/chatController");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);

router.get("/", chatController.getChats); //load chats when user opens their chats on FE
router.post("/", chatController.createChat); //creating a chat (when sitter accepts request )
router.post("/message", chatController.sendMessage); //send message
router.post("/history", chatController.historyOfMessages); //load all messages for chat

module.exports = router;

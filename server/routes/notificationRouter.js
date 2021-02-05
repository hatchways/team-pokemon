const router = require("express").Router();

const notificationController = require("../controllers/notificationController");
const verifyToken = require("../middleware/verifyToken");

//protects all routes after this middleware
router.use(verifyToken);

router.put("/", notificationController.updateNotification);

module.exports = router;

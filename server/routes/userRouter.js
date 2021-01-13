const router = require("express").Router();

const authController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", authController.register);
router.post("/login", authController.login);

// Protect all routes after this middleware
router.use(verifyToken);

module.exports = router;

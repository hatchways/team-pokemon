const router = require("express").Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

// Protect all routes after this middleware
router.use(verifyToken);

router.get("/getuser", userController.getUser);

module.exports = router;

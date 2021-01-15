const router = require("express").Router();

const profileController = require("../controllers/profileControllers");
const verifyToken = require("../middleware/verifyToken");

router.post("/", profileController.create); // create /profile

//protects all routes after this middleware
router.use(verifyToken);
router.put("/:id", profileController.updateProfile); // update /profile:id
router.get("/:id", profileController.getProfile); // get /profile:id
router.get("/", profileController.getProfileList); // get /profile -- returns a list of profiles

module.exports = router;
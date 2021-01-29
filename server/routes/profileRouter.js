const router = require("express").Router();

const profileController = require("../controllers/profileControllers");
const verifyToken = require("../middleware/verifyToken");

router.post("/", profileController.create); // create /profile

//protects all routes after this middleware
router.use(verifyToken);
router.put("/:id", profileController.updateProfile); // update /profile:id
router.get("/:id", profileController.getProfile); // get /profile:id
router.post("/upload/:id", profileController.upload); // upload profile picture
router.delete("/delete/:id", profileController.deletePicture); // delete profile picture
router.get("/list/:id", profileController.getProfileList); // get /profile -- returns a list of profiles
router.put("/availability/:id", profileController.addAvailability) //add availability
router.put("/editavailability/:id", profileController.editAvailability)
module.exports = router;

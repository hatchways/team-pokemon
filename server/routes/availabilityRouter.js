const router = require("express").Router();
const availabilityController = require("../controllers/availabilityController");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken)
router.post("/:id", availabilityController.add);
router.get("/user/:id", availabilityController.getAvailability)//for user to see their availability on certain dates

module.exports = router;
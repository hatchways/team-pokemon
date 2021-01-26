const router = require("express").Router();
const availabilityController = require("../controllers/availabilityController");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken)
router.post("/:id", availabilityController.add);

module.exports = router;
const router = require("express").Router();

const requestController = require("../controllers/requestController");
const verifyToken = require("../middleware/verifyToken");

// Protect all routes after this middleware
router.use(verifyToken);

router
  .route("/")
  .get(requestController.getRequests)
  .post(requestController.createRequest);

router.put("/:id", requestController.updateRequest);
router.post("/:id/pay", requestController.payRequest);

module.exports = router;

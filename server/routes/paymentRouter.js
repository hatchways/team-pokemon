const router = require("express").Router();

const paymentController = require("../controllers/paymentController");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);
router.post("/", paymentController.getCustomer);
router.post("/card", paymentController.addCard);
router.post("/default", paymentController.updateDefault);

module.exports = router;

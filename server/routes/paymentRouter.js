const router = require("express").Router();

const paymentController = require("../controllers/paymentController");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);
router.post("/", paymentController.getCustomer); //get customer from stripe db
router.post("/card", paymentController.addCard); //add crad to customer's account
router.post("/default", paymentController.updateDefault); //update default source (card)

module.exports = router;

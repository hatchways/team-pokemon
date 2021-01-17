const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const makePayment = require("../middleware/makePayment");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);

router.post("/request/:id/pay", makePayment, paymentController.updatePayee); //pay to sitter(id) for the service

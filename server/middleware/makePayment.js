const stripe = require("stripe")(process.env.SECRET_STRIPE_KEY); //need stripe key

//stripe back end
const makePayment = async (req, res, next) => {
  let isError;
  let message;
  try {
    const { method, amount, payeeName } = req.body;

    //create payment instance
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "CAD",
      description: `DogSitter services paid by ${payeeName}.`,
      payment_method: method,
      confirm: true,
    });

    console.log(payment);
    message = "Payment received. Thank you!";
    isError = false;

    return res.status(200).json({ error: isError, message });
  } catch (error) {
    console.log("Error:", error);
    message = error.raw.message;
    isError = true;
    return res.status(400).json({ error: isError, message });
  }
};

module.exports = makePayment;

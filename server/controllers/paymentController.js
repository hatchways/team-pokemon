const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//retrieve a customer with POST by searching their email
exports.getCustomer = async (req, res) => {
  const { id, name, email } = req.body;
  const customerInfo = {
    id: id,
    name: name,
    email: email,
    description: "Dog sitter service customer",
  };
  let existingCustomer = await stripe.customers.list({
    email: email,
  });
  if (existingCustomer.data.length > 0) {
    //customer exists -> retrieve their cards
    const cards = await stripe.customers.listSources(id, {
      object: "card",
      limit: 5,
    });
    const customerCards = await cards.data.map(card => {
      return {
        id: card.id,
        brand: card.brand,
        month: card.exp_month.toString(),
        year: card.exp_year.toString(),
        last4: card.last4,
        isDefault:
          existingCustomer.data[0].default_source == card.id ? true : false,
      };
    });
    res.json({ error: false, cards: customerCards });
  } else {
    //customer doesn't exist yet -> create new customer
    await stripe.customers.create(customerInfo, (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        res.json({
          error: false,
          cards: null,
        });
      } else {
        console.log("Unknown error occured");
      }
    });
  }
};

exports.addCard = async (req, res) => {
  const { userId, token } = req.body;
  const card = await stripe.customers.createSource(userId, {
    source: token.id,
  });
  if (card) {
    res.json({
      error: false,
      data: {
        id: card.id,
        brand: card.brand,
        month: card.exp_month,
        year: card.exp_year,
        last4: card.last4,
      },
    });
  } else {
    res.json({ error: true, data: null });
  }
  return;
};

exports.updateDefault = async (req, res) => {
  const { userId, card } = req.body;
  const customer = await stripe.customers.update(userId, {
    default_source: card,
  });
  if (customer) {
    res.json({ error: false, data: customer.default_source });
  } else {
    res.json({ error: true, data: null });
  }
  return;
};

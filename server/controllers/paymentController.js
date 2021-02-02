const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const createError = require("http-errors");
const Profile = require("../models/profileModel");

//Here CUSTOMER and ACCOUNT are two separate instances of Stripe user representation.
//According to the app - owner can only be "customer", while siiter may have both "customer" and "account" instances

//retrieve a customer by searching their email
exports.getCustomer = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const customerInfo = {
      id: req.user.id,
      name: name,
      email: email,
      description: "Dog sitter service customer",
    };
    //check if Customer exists in Stripe
    let existingCustomer = await stripe.customers.list({
      email: email,
    });

    if (existingCustomer.data.length > 0) {
      //customer exists -> retrieve their cards
      const cards = await stripe.customers.listSources(req.user.id, {
        object: "card",
        limit: 5,
      });
      //map cards to send in response
      let customerCards = await cards.data.map((card) => {
        return {
          id: card.id,
          brand: card.brand,
          month: card.exp_month.toString(),
          year: card.exp_year.toString(),
          last4: card.last4,
          funding: card.funding,
          payout: false,
          isDefault:
            existingCustomer.data[0].default_source == card.id ? true : false,
        };
      });
      //if customer also has a connected account for payouts (applicable to sitters only)
      if (existingCustomer.data[0].metadata.hasOwnProperty("accountId")) {
        let accountCards = await stripe.accounts.listExternalAccounts(
          existingCustomer.data[0].metadata.accountId,
          { object: "card", limit: 1 }
        );
        //add their payout card to represent on FE
        if (accountCards) {
          await customerCards.push({
            id: accountCards.data[0].id,
            brand: accountCards.data[0].brand,
            month: accountCards.data[0].exp_month.toString(),
            year: accountCards.data[0].exp_year.toString(),
            last4: accountCards.data[0].last4,
            funding: accountCards.data[0].funding,
            payout: true,
            isDefault: false,
          });
        }
      }

      return res.json({ error: false, cards: customerCards });
    } else {
      //customer doesn't exist yet -> create new customer
      await stripe.customers.create(customerInfo, async (err, data) => {
        if (err) {
          next(createError(500, err.message));
        }
        if (data) {
          res.json({
            error: false,
            cards: null,
          });
        } else {
          next(createError(500, err.message));
        }
      });
    }
  } catch (err) {
    console.log(err.message);
    next(createError(500, err.message));
  }
};

//add new card
exports.addCard = async (req, res, next) => {
  try {
    const { userId, profileId, token, email, payoutCard } = req.body;
    //retrieve user's information from thei customer instance
    let existingCustomer = await stripe.customers.list({
      email: email,
    });
    //retrieve profile's info to fill up connected account input fields
    const profile = await Profile.findById(profileId);
    //sitter sends the debit card data AND checks the card to be payout card
    if (profile.isSitter && payoutCard) {
      //check if sitter has never added payout card
      if (!existingCustomer.data[0].metadata.hasOwnProperty("accountId")) {
        if (token.card.funding === "debit") {
          //there is no account associated with the customer and they add debit PAYOUT card - create an account
          const account = await stripe.accounts.create({
            country: "CA",
            type: "custom",
            business_type: "individual",
            email: email,
            default_currency: "cad",
            individual: {
              dob: {
                day: profile.birthDate.getDate(),
                month: profile.birthDate.getMonth(),
                year: profile.birthDate.getFullYear(),
              },
              first_name: profile.firstName,
              last_name: profile.lastName,
              address: {
                city: "Toronto",
                country: "CA",
                line1: "Bay str",
                line2: "20",
                state: "ON",
                postal_code: "M5J2N8",
              },
            },
            company: {
              address: {
                city: "Toronto",
                country: "CA",
                line1: "Bay str",
                line2: "20",
                state: "ON",
                postal_code: "M5J2N8",
              },
            },
            business_profile: {
              support_address: {
                city: "Toronto",
                country: "CA",
                line1: "Bay str",
                line2: "20",
                state: "ON",
                postal_code: "M5J2N8",
              },
            },
            tos_acceptance: {
              date: new Date(),
              ip: token.client_ip,
            },
            external_account: token.id,
            capabilities: {
              card_payments: {
                requested: true,
              },
              transfers: {
                requested: true,
              },
            },
          });
          //update customer's metadata to reflect they have connected account number
          const updatedCustomer = await stripe.customers.update(userId, {
            metadata: { accountId: account.id },
          });
        } else {
          //User sent CREDIT (or any other non-debit) card as PAYOUT card
          return res.json({
            error: true,
            message: "Only DEBIT card can be added as Payout card",
          });
        }
      }
      //sitter has an account already - update payout card
      else {
        await stripe.accounts.update(
          existingCustomer.data[0].metadata.accountId,
          { external_account: token.id }
        );
      }
      return res.json({
        error: false,
        data: {
          id: token.card.id,
          brand: token.card.brand,
          month: token.card.exp_month,
          year: token.card.exp_year,
          last4: token.card.last4,
          funding: token.card.funding,
          payout: true,
        },
      });
    }

    //Owner or sitter sends card data to make payments - "Payout card" field was UNchecked
    //add card to user's list
    const card = await stripe.customers.createSource(userId, {
      source: token.id,
    });
    if (!card) {
      return res.json({ error: true, data: null });
    }

    return res.json({
      error: false,
      data: {
        id: card.id,
        brand: card.brand,
        month: card.exp_month,
        year: card.exp_year,
        last4: card.last4,
        funding: card.funding,
        payout: false,
      },
    });
  } catch (err) {
    res.json({ error: true, message: err.raw.message });
  }
};

//update cutomer's default source (card)
exports.updateDefault = async (req, res) => {
  try {
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
  } catch {
    res.json({ error: true, message: err.raw.message });
  }
};

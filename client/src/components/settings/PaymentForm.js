import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  CardActions,
  CircularProgress,
  InputLabel,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Collapse,
} from "@material-ui/core";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { makeStyles } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import { AuthStateContext } from "../../context/AuthContext";
import amex from "../../img/amex.svg";
import master from "../../img/mastercard.svg";
import visa from "../../img/visa.svg";
import credit from "../../img/credit.svg";

const CARD_OPTIONS = {
  style: {
    base: {
      color: "black",
      fontWeight: 500,
      backgroundColor: "#CFD7DF",
      fontSize: "20px",
      "::placeholder": {
        color: "gray",
      },
      ":-webkit-autofill": {
        color: "#e39f48",
      },
    },
    invalid: {
      color: "#E25950",
      "::placeholder": {
        color: "#FFCCA5",
      },
    },
  },
};

const useStyles = makeStyles(theme => ({
  root: { flexgrow: 1 },
  boxParent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: "100%",
    paddingTop: "30px",
  },
  pageHeader: {
    fontWeight: "bold",
    marginBottom: "20px",
  },
  subHeader: {
    color: "gray",
    margin: "20px",
  },
  userCards: {
    width: "100%",
    margin: "0",
  },
  formBox: {
    width: "100%",
    marginBottom: "50px",
  },
  card: {
    border: "1px solid gray",
    height: "230px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  debitCard: {
    fontWeight: "600",
    backgroundColor: "#ccc",
    padding: "3px",
    marginLeft: "-18px",
  },
  cardLogo: {
    height: "50px",
    width: "60px",
    margin: "10px",
  },
  cardCheck: {
    width: "20px",
    height: "20px",
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "0",
  },
  expDate: {
    color: "gray",
    marginTop: "10px",
  },
  addButton: {
    marginTop: "65px",
    marginBottom: "10px",
    color: "orange",
    borderColor: "orange",
  },
  collapse: {
    width: "100%",
  },
  addHintText: {
    textAlign: "center",
    marginBottom: "50px",
  },
  sitterHintText: {
    backgroundColor: "#f28f8f",
    fontWeight: "700",
    margin: "5px",
    padding: "5px",
  },
  cardForm: {
    border: "1px solid gray",
    minWidth: "200px",
    width: "60%",
    minHeight: "100px",
    margin: "auto",
    textAlign: "center",
    padding: "10px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cardElementsBox: {
    width: "100%",
    height: "200px",
  },
  inputLabel: {
    marginTop: "10px",
    marginBottom: "10px",
    fontSize: "18px",
    color: "black",
    textAlign: "left",
  },
  submitButton: {
    marginTop: "40px",
    marginBottom: "20px",
    width: "90%",
  },
  errorMessage: {
    marginBottom: "10px",
    color: "red",
    textAlign: "center",
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: "-20px",
    marginTop: "-20px",
  },
}));

function PaymentForm() {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState();
  const [payout, setPayout] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const { profile, user } = useContext(AuthStateContext);
  const stripe = useStripe();
  const elements = useElements();
  const classes = useStyles();

  useEffect(() => {
    profile && getUserCards();
  }, [profile]);

  useEffect(() => {
    cards &&
      setPayout(() => {
        return cards.some(card => card.payout === true);
      });
  }, [cards]);

  //Retrieve cards that user saved previously.
  const getUserCards = async () => {
    setLoading(true);
    let resp = await axios.post("/api/payment", {
      id: user._id,
      email: user.email,
      name: profile.firstName + " " + profile.lastName,
      isSitter: profile.isSitter,
    });
    if (!resp.data.error) {
      setLoading(false);
      if (!resp.data.cards || resp.data.cards.length < 1) {
        return setMessage("No cards added yet");
      }
      setMessage();
      setCards(resp.data.cards);
    } else {
      return setError("Server error occured");
    }
  };

  //Open card input form to add new card - called via handler to prevent React DOM errors
  const openCardForm = () => {
    setAddCardOpen(true);
  };

  //Flashing messages if card's data (e.g. exp date) is incorrect
  const handleChange = e => {
    if (e.error) {
      return setError(e.error.message);
    }
    return setError(null);
  };

  //create a token for the card that uses wants to add
  const handleSubmit = async e => {
    e.preventDefault();
    if (profile.isSitter && !profile.hasOwnProperty("birthDate")) {
      return setError("Birth Date is required to register a card");
    }
    const card = elements.getElement(CardNumberElement);
    const result = await stripe.createToken(card, { currency: "cad" });
    if (result.error) {
      // Inform the user if there was an error
      return setError(result.error.message);
    }
    setError(null);
    // Send the token to the server
    tokenHandler(result.token);
  };

  //send created token to back end
  const tokenHandler = async token => {
    let resp = await axios.post("/api/payment/card", {
      userId: user._id,
      email: user.email,
      token: token,
      profileId: profile._id,
      payoutCard: checked,
    });
    if (!resp.data.error) {
      elements.getElement(CardNumberElement).clear();
      elements.getElement(CardExpiryElement).clear();
      elements.getElement(CardCvcElement).clear();
      setAddCardOpen(false);
      return getUserCards();
    }
    return setError(resp.data.message);
  };

  //choosing particular radio button chooses the corresponding card as a default source
  const handleRadioButton = async card => {
    let resp = await axios.post("/api/payment/default", {
      userId: user._id,
      card: card,
    });
    if (!resp.data.error) {
      return getUserCards();
    }
    return setError(resp.data.message);
  };

  return (
    <Box className={classes.boxParent}>
      <Typography variant="h4" align="center" className={classes.pageHeader}>
        Payment
      </Typography>
      {loading && <CircularProgress size={40} className={classes.loading} />}
      <Typography variant="h5" className={classes.subHeader}>
        {message ? message : "Saved Payment Profiles:"}
      </Typography>
      <RadioGroup className={classes.userCards}>
        <Grid
          container
          alignItems="center"
          justify="center"
          spacing={6}
          className={classes.userCards}
        >
          {cards &&
            cards.map((card, index) => {
              return (
                <Grid item xl={4} lg={6} md={8} sm={10} xs={12} key={index}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardLogo}
                      image={
                        card.brand === "Visa"
                          ? visa
                          : card.brand === "MasterCard"
                          ? master
                          : card.brand === "American Express"
                          ? amex
                          : credit
                      }
                    />
                    <CardActions className={classes.cardCheck}>
                      {card.payout ? (
                        <Typography
                          variant="subtitle1"
                          className={classes.debitCard}
                        >
                          PayOut
                        </Typography>
                      ) : (
                        <FormControlLabel
                          value={card.brand}
                          control={
                            <Radio
                              icon={<RadioButtonUncheckedIcon />}
                              checkedIcon={<CheckCircleIcon />}
                              checked={card.isDefault}
                              onChange={e => handleRadioButton(card.id)}
                            />
                          }
                        />
                      )}
                    </CardActions>
                    <CardContent>
                      <Typography variant="h5">
                        ****&nbsp; ****&nbsp; ****&nbsp; {card.last4}
                      </Typography>
                      <Typography variant="h6" className={classes.expDate}>
                        Exp. Date{" "}
                        {card.month.length < 2
                          ? "0" + card.month
                          : "" + card.month}
                        /{card.year}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </RadioGroup>
      <Button
        variant="outlined"
        onClick={openCardForm}
        className={classes.addButton}
      >
        + Add New Payment Profile
      </Button>
      <Typography variant="body1" className={classes.addHintText}>
        You can add up to 5 cards
      </Typography>
      {profile && profile.isSitter && !payout && (
        <Typography
          variant="subtitle1"
          className={classes.addHintText + " " + classes.sitterHintText}
        >
          To receive payouts for dog sitting service you need to add DEBIT card!
        </Typography>
      )}
      <Collapse in={addCardOpen} className={classes.collapse}>
        <Box className={classes.formBox} id="formBox">
          <form onSubmit={e => handleSubmit(e)} className={classes.cardForm}>
            <Grid container spacing={3} className={classes.cardElementsBox}>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <InputLabel
                  htmlFor="card-number"
                  className={classes.inputLabel}
                >
                  Card Number
                </InputLabel>
                <CardNumberElement
                  id="card-number"
                  onChange={handleChange}
                  options={CARD_OPTIONS}
                ></CardNumberElement>
              </Grid>
              <br />
              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                <InputLabel
                  htmlFor="card-expiry"
                  className={classes.inputLabel}
                >
                  Expiry
                </InputLabel>
                <CardExpiryElement
                  id="card-expiry"
                  onChange={handleChange}
                  options={CARD_OPTIONS}
                ></CardExpiryElement>
              </Grid>
              <br />
              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                <InputLabel htmlFor="card-cvc" className={classes.inputLabel}>
                  CVC
                </InputLabel>
                <CardCvcElement
                  id="card-cvc"
                  onChange={handleChange}
                  options={CARD_OPTIONS}
                ></CardCvcElement>
              </Grid>
            </Grid>
            {profile && profile.isSitter ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={e => setChecked(e.target.checked)}
                    color="primary"
                  />
                }
                label=" I want to receive payouts to this card (DEBIT only!)"
              />
            ) : null}
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              className={classes.submitButton}
            >
              Submit Card
            </Button>
          </form>
        </Box>
      </Collapse>
      <Typography className={classes.errorMessage} variant="h6">
        {error}
      </Typography>
    </Box>
  );
}

export default PaymentForm;

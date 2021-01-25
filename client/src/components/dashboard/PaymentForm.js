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
      fontSize: "20px",
      backgroundColor: "white",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "gray" },
    },
    invalid: {
      color: "#ffc7ee",
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
    display: "none",
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
  },
  expDate: {
    color: "gray",
    marginTop: "10px",
  },
  addButton: {
    marginTop: "50px",
    marginBottom: "10px",
    color: "orange",
    borderColor: "orange",
  },
  addHintText: {
    textAlign: "center",
    marginBottom: "50px",
  },
  cardForm: {
    backgroundColor: "#f0f0f0",
    border: "1px solid gray",
    minWidth: "200px",
    width: "60%",
    minHeight: "100px",
    margin: "auto",
    textAlign: "center",
    padding: "10px",
    borderRadius: "6px",
  },
  formHeader: {
    marginTop: "20px",
    marginBottom: "40px",
  },
  inputLabel: {
    marginTop: "20px",
    marginBottom: "20px",
    fontSize: "18px",
    color: "black",
    textAlign: "left",
  },
  submitButton: {
    marginTop: "40px",
    marginBottom: "20px",
  },
  errorMessage: {
    margin: "10px",
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
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const { profile, user } = useContext(AuthStateContext);
  const stripe = useStripe();
  const elements = useElements();
  const classes = useStyles();

  useEffect(() => {
    profile && getUserCards();
  }, [profile]);

  const getUserCards = async () => {
    setLoading(true);
    let resp = await axios.post("/api/payment", {
      id: profile._id,
      email: user.email,
      name: profile.firstName + " " + profile.lastName,
    });
    if (!resp.data.error) {
      setLoading(false);
      if (resp.data.cards.length < 1 || !resp.data.cards) {
        return setMessage("No cards added yet");
      }
      setMessage();
      setCards(resp.data.cards);
    } else {
      return setError("Server error occured. Please refresh the page");
    }
    //setLoading(false);
  };

  const openCardForm = () => {
    document.getElementById("formBox").style.display = "block";
  };

  const handleChange = e => {
    if (e.error) {
      return setError(e.error.message);
    }
    return setError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const card = elements.getElement(CardNumberElement);
    const result = await stripe.createToken(card);
    if (result.error) {
      // Inform the user if there was an error
      return setError(result.error.message);
    }
    setError(null);
    // Send the token to the server
    tokenHandler(result.token);
  };

  const tokenHandler = async token => {
    let resp = await axios.post("/api/payment/card", {
      userId: profile._id,
      token: token,
    });
    if (!resp.data.error) {
      elements.getElement(CardNumberElement).clear();
      elements.getElement(CardExpiryElement).clear();
      elements.getElement(CardCvcElement).clear();
      document.getElementById("formBox").style.display = "none";
      return getUserCards();
    }
    return setError("Error occured. Please try again");
  };

  const handleRadioButton = async card => {
    let resp = await axios.post("/api/payment/default", {
      userId: profile._id,
      card: card,
    });
    if (!resp.data.error) {
      return getUserCards();
    }
    return setError("Error ocurred. Please try again");
  };

  return (
    <Box
      className={classes.boxParent}
      style={{ width: "100%", paddingTop: "30px" }}
    >
      <Typography
        variant="h4"
        align="center"
        style={{ fontWeight: "bold", marginBottom: "20px" }}
      >
        Payment
      </Typography>
      {loading && <CircularProgress size={40} className={classes.loading} />}
      <Typography variant="h5" className={classes.subHeader}>
        {message ? message : "Saved Payment Profiles:"}
      </Typography>
      <RadioGroup>
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
      <Box className={classes.formBox} id="formBox">
        <form onSubmit={e => handleSubmit(e)} className={classes.cardForm}>
          <Typography variant="h5" className={classes.formHeader}>
            Card Details
          </Typography>
          <Box>
            <InputLabel htmlFor="card-number" className={classes.inputLabel}>
              Card Number
            </InputLabel>
            <CardNumberElement
              id="card-number"
              onChange={handleChange}
              options={CARD_OPTIONS}
            ></CardNumberElement>
            <br />
            <InputLabel htmlFor="card-expiry" className={classes.inputLabel}>
              Card Expiry
            </InputLabel>
            <CardExpiryElement
              id="card-expiry"
              onChange={handleChange}
              options={CARD_OPTIONS}
            ></CardExpiryElement>
            <br />
            <InputLabel htmlFor="card-cvc" className={classes.inputLabel}>
              Card Expiry
            </InputLabel>
            <CardCvcElement
              id="card-cvc"
              onChange={handleChange}
              options={CARD_OPTIONS}
            ></CardCvcElement>
          </Box>
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
      <Typography className={classes.errorMessage} variant="h6">
        {error}
      </Typography>
    </Box>
  );
}

export default PaymentForm;

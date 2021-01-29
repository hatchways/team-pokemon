import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import {
  AuthStateContext,
  AuthDispatchContext,
} from "../../context/AuthContext";
import { payRequest } from "../../actions/request";
import PaymentCardItem from "./PaymentCardItem";
import { CLEAR_ERRORS } from "../../actions/types";

const useStyles = makeStyles((theme) => ({
  modalBackground: {
    position: "fixed",
    width: "100%",
    height: "100vh",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: "10000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    width: "50%",
    borderRadius: "5px",
    padding: "10px 30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  modalWidthBreakPoints: {},
  close: {
    alignSelf: "flex-end",
    "&:hover": { color: "black", cursor: "pointer" },
  },
  noPaymentText: {
    marginBottom: "20px",
    color: "black",
    width: "80%",
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "500",
    fontSize: "20px",
  },
  noPaymentButton: {
    marginBottom: "20px",
  },
  loading: {
    marginBottom: "20px",
  },
  modalMargin: {
    marginBottom: "30px",
  },
  modalContentWidth: {
    width: "100%",
  },
  cardListText: {
    alignSelf: "flex-start",
    color: "#000",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: "10px",
  },
  costCalculationAlignment: {
    display: "flex",
    justifyContent: "space-between",
    color: "#000",
    fontWeight: "500",
  },
  costTotalBorder: {
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    fontWeight: "bold",
  },
  payButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  errorMessage: {
    color: "red",
    textAlign: "end",
    fontWeight: "500",
  },
}));

function PaymentModal({ request, togglePaymentModal, cards, setCards }) {
  const classes = useStyles();
  let history = useHistory();

  const [payButtonSpinner, setPayButtonSpinner] = useState(false);

  // Obtain state from context
  const { user, profile, errors } = useContext(AuthStateContext);
  const dispatch = useContext(AuthDispatchContext);

  // Make API call to stripe to get user's card details
  useEffect(() => {
    const getCards = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({
        name: `${profile.firstName} ${profile.lastName}`,
        email: user.email,
      });
      if (!cards) {
        const results = await axios.post(`/api/payment/`, body, config);
        setCards(results.data);
      }
    };
    getCards();
  }, [profile.firstName, profile.lastName, user.email, setCards, cards]);

  // Calculates hours worked for current booking
  const hoursWorked = moment(request.end).diff(
    moment(request.start),
    "hours",
    true
  );

  // Hourly Rate
  const hourlyRate = 14;

  // Redirects user to payments page.
  const handlePaymentPageRedirect = () => {
    history.push("/dashboard/payment");
  };

  // Handle payments
  const handlePay = () => {
    setPayButtonSpinner(true);
    if (errors.length > 0) {
      dispatch({ type: CLEAR_ERRORS });
    }
    const payload = {
      id: request._id,
      amount: hourlyRate * hoursWorked,
    };
    payRequest(dispatch, payload);
  };

  return (
    <Box className={classes.modalBackground}>
      <Box className={classes.modal}>
        <CloseIcon
          fontSize="large"
          className={classes.close}
          onClick={() => {
            dispatch({ type: CLEAR_ERRORS });
            togglePaymentModal(false);
          }}
        />
        {!cards ? (
          <CircularProgress className={classes.loading} />
        ) : (
          [
            cards.cards.length > 0 ? (
              <>
                <Typography className={classes.cardListText}>
                  Payment Card:
                </Typography>
                <Box
                  className={
                    classes.modalContentWidth + " " + classes.modalMargin
                  }
                >
                  {cards.cards
                    .filter((card) => card.isDefault)
                    .map((card) => (
                      <PaymentCardItem key={card.id} card={card} />
                    ))}
                </Box>
                <Box
                  className={
                    classes.modalContentWidth + " " + classes.modalMargin
                  }
                >
                  <Box className={classes.costCalculationAlignment}>
                    <Typography>Hourly Rate:</Typography>
                    <Typography>${hourlyRate}</Typography>
                  </Box>
                  <Box className={classes.costCalculationAlignment}>
                    <Typography>Hours:</Typography>
                    <Typography>{hoursWorked}</Typography>
                  </Box>
                  <Box className={classes.costCalculationAlignment}>
                    <Typography>Total:</Typography>
                    <Typography className={classes.costTotalBorder}>
                      ${hourlyRate * hoursWorked}
                    </Typography>
                  </Box>
                </Box>
                {errors.length > 0 && (
                  <Box
                    className={
                      classes.modalContentWidth + " " + classes.modalMargin
                    }
                  >
                    <Typography className={classes.errorMessage}>
                      Error: {errors[0]}
                    </Typography>
                  </Box>
                )}
                <Box
                  className={
                    classes.payButtons +
                    " " +
                    classes.modalContentWidth +
                    " " +
                    classes.modalMargin
                  }
                >
                  <ButtonGroup>
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={handlePaymentPageRedirect}
                    >
                      Change default card
                    </Button>
                    {request.paid ? (
                      <Button
                        color="primary"
                        variant="contained"
                        disabled={true}
                      >
                        `PAID`
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        variant="contained"
                        disabled={request.paid}
                        onClick={() => handlePay()}
                      >
                        {payButtonSpinner && errors.length === 0 ? (
                          <CircularProgress color="white" size={20} />
                        ) : (
                          `PAY`
                        )}
                      </Button>
                    )}
                  </ButtonGroup>
                </Box>
              </>
            ) : (
              <>
                <Typography className={classes.noPaymentText}>
                  You have not added a payment method to your account.
                </Typography>
                <Button
                  className={classes.noPaymentButton}
                  variant="contained"
                  color="primary"
                  onClick={handlePaymentPageRedirect}
                >
                  Add a card now
                </Button>
              </>
            ),
          ]
        )}
      </Box>
    </Box>
  );
}

export default PaymentModal;

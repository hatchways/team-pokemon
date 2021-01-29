import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import { AuthStateContext } from "../../context/AuthContext";

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
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
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
}));

function PaymentModal({ togglePaymentModal }) {
  const classes = useStyles();
  let history = useHistory();

  const [cards, setCards] = useState(null);

  const { user, profile } = useContext(AuthStateContext);

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
      const results = await axios.post(`/api/payment/`, body, config);
      setCards(results.data);
    };
    getCards();
  }, [profile.firstName, profile.lastName, user.email]);
  console.log(cards);
  const handlePaymentPageRedirect = () => {
    history.push("/dashboard/payment");
  };

  return (
    <Box className={classes.modalBackground}>
      <Box className={classes.modal}>
        <CloseIcon
          fontSize="large"
          className={classes.close}
          onClick={() => togglePaymentModal(false)}
        />
        {!cards ? (
          <CircularProgress className={classes.loading} />
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
        )}
      </Box>
    </Box>
  );
}

export default PaymentModal;

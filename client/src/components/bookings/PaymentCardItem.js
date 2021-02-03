import React from "react";
import { Box, CardMedia, makeStyles, Typography } from "@material-ui/core";
import amex from "../../img/amex.svg";
import master from "../../img/mastercard.svg";
import visa from "../../img/visa.svg";
import credit from "../../img/credit.svg";

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "0 10px",
    borderRadius: "5px",
    boxSizing: "border-box",
    backgroundColor: "#e6e6e6",
  },
  cardContainerBreakpoints: {
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
    },
  },
  cardLogo: {
    width: "50px",
    height: "50px",
  },
  cardLogoBreakpoints: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  cardText: {
    color: "black",
  },
}));

function PaymentCardItem({ card }) {
  const classes = useStyles();

  // brand: "Visa"
  // funding: "debit"
  // id: "card_1IEwiJR8jL79LIv1TjTQmImV"
  // isDefault: false
  // last4: "0005"
  // month: "11"
  // payout: true
  // year: "2023"
  return (
    <Box
      className={classes.cardContainer + " " + classes.cardContainerBreakpoints}
    >
      <CardMedia
        className={classes.cardLogo + " " + classes.cardLogoBreakpoints}
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
      <Typography
        className={classes.cardText}
      >{`${card.brand} ending in ${card.last4}`}</Typography>
      <Typography
        className={classes.cardText}
      >{`Expires on ${card.month}/${card.year}`}</Typography>
    </Box>
  );
}

export default PaymentCardItem;

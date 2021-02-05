import React, { useContext, useState, useEffect } from "react";
import { updateRequest } from "../../actions/requests";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import {
  AuthDispatchContext,
  AuthStateContext,
} from "../../context/AuthContext";
import Alert from "../Alert";
import PaymentModal from "./PaymentModal";

const useStyles = makeStyles((theme) => ({
  requestSpacing: {
    marginTop: "10px",
    marginBottom: "10px",
    padding: "15px",
    border: "3px solid #e6e6e6",
  },
  avatarSize: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  lightGreyColor: {
    color: "#e6e6e6",
    fontWeight: "bold",
    letterSpacing: "1.5px",
  },
  buttonWidth: {
    width: "70px",
  },
}));

function RequestStatus({ request, modeTime }) {
  const classes = useStyles();
  const [acceptButtonSubmitting, setAcceptButtonSubmitting] = useState(false);
  const [declineButtonSubmitting, setDeclineButtonSubmitting] = useState(false);
  const [cards, setCards] = useState(null);
  const [paymentModal, togglePaymentModal] = useState(false);

  // Get dispatch method from context
  const dispatch = useContext(AuthDispatchContext);
  const { profile, errors } = useContext(AuthStateContext);

  useEffect(() => {
    if (errors.length > 0) {
      setAcceptButtonSubmitting(false);
    }
  }, [errors.length]);

  // Conditional variables to be used to determine which status to show on the request

  const showAcceptDeclineButtons =
    modeTime === "sitterCurrent" && !request.accepted && !request.declined;

  const showPayButton =
    modeTime === "ownerPast" && request.accepted && !request.paid;

  const showAwaitingPayment =
    modeTime === "sitterPast" && request.accepted && !request.paid;

  const showPaid =
    (modeTime === "ownerPast" || modeTime === "sitterPast") &&
    request.accepted &&
    request.paid;

  const showPending =
    modeTime === "ownerCurrent" && !request.accepted && !request.declined;

  const showExpired =
    (modeTime === "ownerPast" || modeTime === "sitterPast") &&
    !request.accepted &&
    !request.declined;

  const showAccepted = request.accepted;

  return (
    <Box className={classes.lightGreyColor}>
      {paymentModal && (
        <PaymentModal
          togglePaymentModal={togglePaymentModal}
          request={request}
          cards={cards}
          setCards={setCards}
        />
      )}
      {showAcceptDeclineButtons ? (
        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonWidth}
            onClick={() => {
              setAcceptButtonSubmitting(true);
              updateRequest(
                dispatch,
                { accepted: true },
                request._id,
                request.ownerId,
                `${profile.firstName} ${profile.lastName}`
              );
            }}
          >
            {acceptButtonSubmitting ? (
              <CircularProgress color="white" size={20} />
            ) : (
              `ACCEPT`
            )}
          </Button>
          <Button
            color="secondary"
            className={classes.buttonWidth}
            onClick={() => {
              setDeclineButtonSubmitting(true);
              updateRequest(
                dispatch,
                { declined: true },
                request._id,
                request.ownerId,
                `${profile.firstName} ${profile.lastName}`
              );
            }}
          >
            {declineButtonSubmitting ? (
              <CircularProgress color="white" size={20} />
            ) : (
              `DECLINE`
            )}
          </Button>
        </ButtonGroup>
      ) : (
        [
          showPayButton ? (
            <Button
              variant="contained"
              color="primary"
              className={classes.buttonWidth}
              onClick={() => togglePaymentModal(true)}
            >
              {acceptButtonSubmitting ? (
                <CircularProgress color="white" size={20} />
              ) : (
                `PAY`
              )}
            </Button>
          ) : (
            [
              showAwaitingPayment ? (
                <Typography className={classes.lightGreyColor}>
                  AWAITING PAYMENT
                </Typography>
              ) : (
                [
                  showPaid ? (
                    <Typography className={classes.lightGreyColor}>
                      PAID
                    </Typography>
                  ) : (
                    [
                      showPending ? (
                        <Typography className={classes.lightGreyColor}>
                          PENDING
                        </Typography>
                      ) : (
                        [
                          showExpired ? (
                            <Typography className={classes.lightGreyColor}>
                              EXPIRED
                            </Typography>
                          ) : (
                            [
                              showAccepted ? (
                                <Typography className={classes.lightGreyColor}>
                                  ACCEPTED
                                </Typography>
                              ) : (
                                <Typography className={classes.lightGreyColor}>
                                  DECLINED
                                </Typography>
                              ),
                            ]
                          ),
                        ]
                      ),
                    ]
                  ),
                ]
              ),
            ]
          ),
        ]
      )}
      {errors.length > 0 && (
        <Alert alert={{ error: true, message: errors[0] }} />
      )}
    </Box>
  );
}

export default RequestStatus;

import React, { useContext, useState } from "react";
import { updateRequest } from "../../actions/requests";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { AuthDispatchContext } from "../../context/AuthContext";

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

  // Get dispatch method from context
  const dispatch = useContext(AuthDispatchContext);

  return (
    <Box className={classes.lightGreyColor}>
      {/* Show Accept/Decline Buttons if:
      - User is in sitter mode,
      - the request is current,
      - the request hasn't been accepted or declined yet  
      
        Show 'Pending' Text if:
      - User is in owner mode,
      - the request is current,
      - the request hasn't been accepted or declined yet

        Show 'Expired' Text if:
      - it is a past request,
      - the request wasn't accepted or declined.

        Show 'Accepted' Text if:
      - The request was accepted

        Show 'Declined' Text if:
      - The request was declined
      */}
      {modeTime === "sitterCurrent" &&
      !request.accepted &&
      !request.declined ? (
        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonWidth}
            onClick={() => {
              setAcceptButtonSubmitting(true);
              updateRequest(dispatch, { accepted: true }, request._id);
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
              updateRequest(dispatch, { declined: true }, request._id);
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
          modeTime === "ownerCurrent" &&
          !request.accepted &&
          !request.declined ? (
            <Typography className={classes.lightGreyColor}>PENDING</Typography>
          ) : (
            [
              modeTime === "past" && !request.accepted && !request.declined ? (
                <Typography className={classes.lightGreyColor}>
                  EXPIRED
                </Typography>
              ) : (
                [
                  request.accepted ? (
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
      )}
    </Box>
  );
}

export default RequestStatus;

import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  Box,
  ClickAwayListener,
  Grow,
  MenuList,
  MenuItem,
  Paper,
  Popper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import io from "socket.io-client";
import {
  AuthDispatchContext,
  AuthStateContext,
} from "../../context/AuthContext";
import { updateNotification } from "../../actions/notifications";

const socket = io();

const useStyles = makeStyles(() => ({
  buttonText: {
    fontSize: "12px",
    fontWeight: 500,
  },
  buttonPadding: {
    padding: "8px 11px",
  },
  notificationDot: {
    marginBottom: "auto",
    marginLeft: "5px",
  },
  notificationPaginationContainer: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  arrowContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  arrow: {
    fontSize: "20px",
    fontWeight: "bold",

    "&:hover": {
      cursor: "pointer",
    },
  },
  unreadNotification: {
    fontWeight: "bold",
  },
  linkStyles: {
    textDecoration: "none",
    color: "#000",
  },
}));

function Notifications() {
  const classes = useStyles();

  // Get notifications from user context
  const { profile } = useContext(AuthStateContext);
  const dispatch = useContext(AuthDispatchContext);

  const [open, setOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    setShowBadge(false);
  }, [profile.notifications]);

  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const handleNotificationClick = () => {
    // Only update notifications on back-end if there are unread notifications
    if (showBadge) {
      updateNotification(dispatch);
    }
    setOpen(false);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const [notificationStart, setNotificationStart] = useState(0);
  const [notificationEnd, setNotificationEnd] = useState(10);

  // Map notifications from database into MenuItems
  const notificationsPaginated = profile.notifications.slice(
    notificationStart,
    notificationEnd
  );

  const notificationsStyles = notificationsPaginated.map((notification) => {
    if (!notification.read) {
      if (!showBadge) {
        setShowBadge(true);
      }
      return (
        <Link to="/bookings" className={classes.linkStyles}>
          <MenuItem
            className={classes.unreadNotification}
            onClick={() => handleNotificationClick()}
          >
            {notification.message}
          </MenuItem>
        </Link>
      );
    } else {
      return (
        <Link to="/bookings" className={classes.linkStyles}>
          <MenuItem onClick={() => handleNotificationClick()}>
            {notification.message}{" "}
          </MenuItem>
        </Link>
      );
    }
  });

  const handleNotificationLeftArrowClick = () => {
    if (notificationStart === 0) {
      return;
    }

    setNotificationStart(notificationStart - 10);
    setNotificationEnd(notificationEnd - 10);
  };

  const handleNotificationRightArrowClick = () => {
    if (notificationEnd > profile.notifications.length) {
      return;
    }

    setNotificationStart(notificationStart + 10);
    setNotificationEnd(notificationEnd + 10);
  };

  return (
    <div>
      <Button
        className={classes.buttonPadding}
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Typography className={classes.buttonText}>Notifications</Typography>
        {showBadge && (
          <Badge
            color="primary"
            variant="dot"
            className={classes.notificationDot}
          ></Badge>
        )}
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  {profile.notifications && profile.notifications.length > 0 ? (
                    <>
                      {notificationsStyles}
                      <Box className={classes.notificationPaginationContainer}>
                        {
                          <Box className={classes.arrowContainer}>
                            <Typography
                              className={classes.arrow}
                              onClick={() => handleNotificationLeftArrowClick()}
                            >
                              &larr;
                            </Typography>
                            <Typography
                              className={classes.arrow}
                              onClick={() =>
                                handleNotificationRightArrowClick()
                              }
                            >
                              &rarr;
                            </Typography>
                          </Box>
                        }
                      </Box>
                    </>
                  ) : (
                    <MenuItem onClick={handleClose}>
                      You have no notifications.
                    </MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}

export default Notifications;

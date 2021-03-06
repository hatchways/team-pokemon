import React, { useContext } from "react";
import { IconButton, Box, Dialog, DialogActions } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import SettingsMenu from "../settings/SettingsMenu";
import { UserContext } from "../../context/Context";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: { flexgrow: 1 },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  gridElement: {
    maxWidth: "350px",
    width: "85%",
    textAlign: "center",
    height: "80px",
    margin: "30px auto 30px",
  },
  menuButton: {
    width: "100%",
    height: "100%",
    fontSize: "30px",
  },
  dialogStyling: {
    padding: "0",
  },
  hamburgerIcon: {
    zIndex: 100,
  },
  settingsMenuAlignment: {
    marginTop: "50px",
  },
}));

function MobileNavbar() {
  const { mobileMenuOpen, setMobileMenuOpen } = useContext(UserContext);
  const classes = useStyles();
  return (
    <Dialog open={mobileMenuOpen} fullScreen TransitionComponent={Transition}>
      <Box>
        <DialogActions className={classes.dialogStyling}>
          <IconButton
            aria-label="close"
            className={classes.closeButton + " " + classes.hamburgerIcon}
            onClick={() => setMobileMenuOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
      </Box>
      <Box className={classes.settingsMenuAlignment}>
        <SettingsMenu />
      </Box>
    </Dialog>
  );
}

export default MobileNavbar;

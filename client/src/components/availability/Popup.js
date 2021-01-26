import React from 'react';
import {Dialog, DialogTitle, DialogContent } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';

function Popup(props){
    const {title, children, openPopup, setOpenPopup} = props; 
    return (
        <Dialog open={openPopup}>
            <DialogTitle>
                <div> Add Availability</div>
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default Popup;
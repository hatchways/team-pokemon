const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },
    date: {
        type: Date,
    },
    timesAvailable: {
        type: [Object],
    }
})
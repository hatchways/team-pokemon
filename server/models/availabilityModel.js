const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },
    date: {
        type: Date,
    },
    timesAvailable: [{
        from: String,
        to: String
    }]
});

const Availability = mongoose.model("Availability", availabilitySchema);

module.exports = Availability;
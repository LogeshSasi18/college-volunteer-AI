const mongoose = require('mongoose');

require("./User");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  requiredVolunteers: { type: Number, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Event Creator
  registeredVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Volunteer" }],
});

module.exports = mongoose.model('Event', EventSchema);
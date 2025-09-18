const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  eventId: mongoose.Schema.Types.ObjectId,
  rating: Number,
  comment: String
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
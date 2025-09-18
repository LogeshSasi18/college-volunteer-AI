const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  message: String,
  seen: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', NotificationSchema);
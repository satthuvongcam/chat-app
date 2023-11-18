const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  recepientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: String,
  body: String,
  timeStamp: {
    type: Date,
    default: Date.now,
  },
})

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification

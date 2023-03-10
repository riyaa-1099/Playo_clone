const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    game: {
      type: String,
      required: true,
    },
    information: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    maxPlayers: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pendingRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    acceptedRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    rejectedRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

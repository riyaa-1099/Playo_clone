const mongoose = require('mongoose');
const Usermodel = require("../models/userModel.js");
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
      ref: Usermodel,
      required: true,
    },
    pendingRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: Usermodel
    }],
    acceptedRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: Usermodel
    }]
  },
  { timestamps: true }
);

const Event = mongoose.model('playoEvent', eventSchema);

module.exports = Event;

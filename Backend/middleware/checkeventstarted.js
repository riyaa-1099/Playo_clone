// Middleware to check if event has started
const Event = require("../models/eventModel.js");

const deleteExpiredRequests = async (req,res,next) => {
  try {
    // Find all events with start time less than current time
    const expiredEvents = await Event.find({ startTime: { $lte: new Date() } });

    // Delete pending requests of expired events
    for (const event of expiredEvents) {
      event.pendingRequests = [];
      await event.save();
    }

    console.log(`Deleted pending requests of ${expiredEvents.length} expired events`);
    next()
  } 
  catch (error) {
    console.log(error);
  }
};

  module.exports = deleteExpiredRequests;
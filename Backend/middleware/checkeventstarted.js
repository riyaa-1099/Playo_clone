// Middleware to check if event has started

const checkEventStarted = async (req, res, next) => {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    
    if (event.startTime < new Date()) {
      // Expire all pending requests for the event
      event.pendingRequests = [];
      await event.save();
  
      return res.status(400).send({
        msg: "The event has already started, all pending requests have been expired",
        status: "fail",
      });
    }
  
    next();
  };

  module.exports = checkEventStarted;
const express = require("express");
const eventRouter = express.Router();

const deleteExpiredRequests = require("../middleware/checkeventstarted");

const Event = require("../models/eventModel.js");

//------------------------------------ Creating event which includes maxplayers, time etc properties

eventRouter.post("/create", async (req, res) => {
  const { game, information, startTime, maxPlayers, userId } = req.body;

  try {
    const event = new Event({
      game,
      information,
      startTime,
      maxPlayers,
      createdBy: userId,
    });
    await event.save();
    res.send({ msg: "Event is created successfully", status: "success" });
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong", status: "error" });
  }
});

//------------------------------------- Getting all events which were created for Home Page

eventRouter.get("/", deleteExpiredRequests, async (req, res) => {
  try {
    //.populate("createdBy", "username -_id")
    const events = await Event.find().sort({ startTime: 1 });
    res.send(events);
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong", status: "error" });
  }
});

//------------------------------------Details of particular event displayed

eventRouter.get("/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId).populate(
      "createdBy",
      "username-_id"
    );

    if (!event) {
      return res.status(404).send({ msg: "Event not found", status: "fail" });
    }

    const {
      game,
      information,
      startTime,
      maxPlayers,
      createdBy,
      acceptedRequests,
    } = event;

    const usernames = acceptedRequests.map((user) => user.username);

    res.send({
      game,
      information,
      startTime,
      maxPlayers,
      createdBy,
      acceptedRequests: usernames,
    });
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong", status: "error" });
  }
});

//------------------------------- Getting events created by a user herself

eventRouter.get("/getmyevents", async (req, res) => {
  const userId = req.body.userId;

  try {
    const events = await Event.find({ createdBy: userId }).sort({
      startTime: 1,
    });
    res.send(events);
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong", status: "error" });
  }
});

//---------------------------------- Requesting to join an event
//640c5dfc8a3a6cd405d91ab9

eventRouter.post("/requesttojoin/:id", async (req, res) => {
  const eventId = req.params.id;
  const userId = req.body.userId;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.send({ msg: "Event does not exist", status: "fail" });
    }

    // Checking if the event has already started
    const now = new Date();
    if (event.startTime <= now) {
      return res.status(400).send({
        msg: "Event has already started cant join now",
        status: "fail",
      });
    }

    if (
      event.acceptedRequests.includes(userId) ||
      event.pendingRequests.includes(userId)
    ) {
      return res.send({
        msg: "You have already joined or requested to join the event",
        status: "fail",
      });
    }

    event.pendingRequests.push(userId);
    await event.save();
    res.send({
      msg: "Request sent, kindly wait for approval",
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong", status: "error" });
  }
});

//---------------------------------------- POST request to approve a pending request and add to acceptedRequests array

eventRouter.post("/approve-request/:eventId/:requestId", async (req, res) => {
  const { eventId, requestId } = req.params;
  const userId = req.body.userId;
  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).send({
        msg: "Event not found",
        status: "fail",
      });
    }

    if (event.createdBy.toString() !== userId) {
      return res.status(401).send({
        msg: "You are not authorized to approve requests for this event",
        status: "fail",
      });
    }

    const pendingRequest = event.pendingRequests.find(
      (request) => request._id.toString() === requestId
    );

    if (!pendingRequest) {
      return res.status(404).send({
        msg: "Pending request not found",
        status: "fail",
      });
    }

    event.acceptedRequests.push(pendingRequest._id.toString());
    event.pendingRequests = event.pendingRequests.filter(
      (request) => request._id.toString() !== requestId
    );
    console.log(pendingRequest._id.toString(), requestId);
    await event.save();

    return res.send({
      msg: "Request approved and added to accepted requests, lets meet !",
      status: "success",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      msg: "Internal server error",
      status: "error",
    });
  }
});

//---------------------------------------------------- Getting pending requests for an event

eventRouter.get("/pendingrequests/:id", async (req, res) => {
  let eventId = req.params.id;
  const userId = req.body.userId;

  try {
    const event = await Event.findById(eventId)
      .populate({
        path: "pendingRequests",
        select: "username",
      })
      .populate({
        path: "acceptedRequests",
        select: "username",
      });

    if (!event) {
      return res.send({ msg: "Event does not exist", status: "fail" });
    }
    if (event.createdBy.toString() !== userId) {
      return res.send({ msg: "Not authorized to see", status: "fail" });
    }
    res.send(event);
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong", status: "error" });
  }
});

// --------------------------------------------------Cancel a request to join an event by user

eventRouter.put("/cancel/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body;

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send({ msg: "Event not found", status: "fail" });
    }

    // Checking if the event has already started
    const now = new Date();
    if (event.startTime <= now) {
      return res
        .status(400)
        .send({ msg: "Event has already started", status: "fail" });
    }

    // Checking if the user has requested to join the event

    const userIndex = event.pendingRequests.indexOf(userId);
    const userIndex2 = event.acceptedRequests.indexOf(userId);

    if (userIndex === -1 && userIndex2 === -1) {
      return res.status(400).send({
        msg: "You have not requested to join this event",
        status: "fail",
      });
    } else if (userIndex !== -1 && userIndex2 === -1) {
      event.pendingRequests.splice(userIndex, 1);

      await event.save();

      res.send({ msg: "Request cancelled successfully", status: "success" });
    } else {
      event.acceptedRequests.splice(userIndex, 1);

      await event.save();

      res.send({ msg: "Request cancelled successfully", status: "success" });
    }
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something went wrong", status: "error" });
  }
});

module.exports = eventRouter;

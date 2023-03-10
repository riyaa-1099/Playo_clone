const express = require("express");
const eventRouter = express.Router();
const authentication = require("../middleware/auth");
const Event = require("../models/Event");
const User = require("../models/User");


// Creating event which includes maxplayers, time

eventRouter.post("/create", authentication, async (req, res) => {
  const { game, information, startTime, maxPlayers } = req.body;
  const userId = req.body.userId;

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
  } 
  catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong", status: "error" });
  }
});

// Getting all events created 

eventRouter.get("/", async (req, res) => {
    try {
      const events = await Event.find().populate("createdBy", "username");
      res.send(events);
    } catch (error) {
      console.log(error);
      res.send({ msg: "Something went wrong", status: "error" });
    }
  });



  // Getting events created by a user herself

eventRouter.get("/getmyevents", authentication, async (req, res) => {
    const userId = req.body.userId;
  
    try {
      const events = await Event.find({ createdBy: userId });
      res.send(events);
    } catch (error) {
      console.log(error);
      res.send({ msg: "Something went wrong", status: "error" });
    }
  });


// Requesting to join an event

eventRouter.post("/requesttojoin/:id", authentication, async (req, res) => {
    const eventId = req.params.id;
    const userId = req.body.userId;
  
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.send({ msg: "Event does not exist", status: "fail" });
      }
      if (event.maxPlayers <= event.acceptedRequests.length) {
        return res.send({ msg: "Players already booked, No slots available", status: "fail" });
      }
      if (event.acceptedRequests.includes(userId)) {
        return res.send({
          msg: "You have already joined the event",
          status: "fail",
        });
      }
      if (event.pendingRequests.includes(userId)) {
        return res.send({
          msg: "You have already requested",
          status: "fail",
        });
      }
      event.pendingRequests.push(userId);
      await event.save();
      res.send({ msg: "Request sent, kindly wait for approval", status: "success" });
    } catch (error) {
      console.log(error);
      res.send({ msg: "Something went wrong", status: "error" });
    }
  });



  // Getting pending requests for an event

eventRouter.get("/pendingrequests/:id", authentication, async (req, res) => {
    const eventId = req.params.id;
  
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.send({ msg: "Event does not exist", status: "fail" });
      }
      //console.log(event.createdBy.toString())
      if (event.createdBy.toString() !== req.body.userId) {
        return res.send({ msg: "Not authorized to see", status: "fail" });
      }
      const pendingRequests = await User.find({
        _id: { $in: event.pendingRequests },
      });
      res.send(pendingRequests);
    } 
    catch (error) {
      console.log(error);
      res.send({ msg: "Something went wrong", status: "error" });
    }
  });
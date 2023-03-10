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

// Getting all events created by all

eventRouter.get("/", async (req, res) => {
    try {
      const events = await Event.find().populate("createdBy", "username");
      res.send(events);
    } catch (error) {
      console.log(error);
      res.send({ msg: "Something went wrong", status: "error" });
    }
  });
const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Redis = require("ioredis");

const authentication = require("../middleware/auth");
const Usermodel = require("../models/userModel");

const redis = new Redis({
  host: process.env.redishost,
  port: process.env.redisport,
  password: process.env.redispassword,
  username: process.env.redisusername,
});

// --------------User Signup Router

userRouter.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ msg: "Complete your details", status: "fail" });
  }

  const user = await Usermodel.find({ username });

  if (user.length >= 1) {
    return res.status(409).send({ msg: "User already exists", status: "fail" });
  } else {
    try {
      bcrypt.hash(password, 4, async function (err, hash) {
        if (err) {
          //console.log(err);
          res.send({ msg: "error while signing in", status: "error" });
        } else {
          const current = new Usermodel({ username, password: hash });
          await current.save();

          res.send({ msg: "Sign-up Successfull", status: "success" });
        }
      });
    } catch (err) {
      // console.log(err)
      res.send({ msg: "Something went wrong", status: "error" });
    }
  }
});

// ----------User login router

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {

    return res.status(400).send({ msg: "Complete your details", status: "fail" });

  }
  try {
    const user = await Usermodel.find({ username });

    if (user.length > 0) {

      const hashed_password = user[0].password;
      bcrypt.compare(password, hashed_password, function (err, result) {
        if (result) {
          let { token } = tokencreate(res, user[0]._id);

          res.send({
            msg: "Login Successfull",
           status: "success",
            token: token          
          });

        } 
        else {

            res.send({ msg: "Wrong Credentials", status: "fail" });
        
        }
      });

    } 
    else {

      res.send({ msg: "User not found" });

    }
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something went wrong", status: "error" });
  }
});

const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
require("dotenv").config();

const Usermodel = require("../models/userModel");
const tokencreate=require("../helpers/token")



// User Signup Router

userRouter.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ msg: "Complete your details", status: "fail" });
  }

  const user = await Usermodel.findOne({ username });

  if (user) {
    return res.status(409).send({ msg: "User already exists", status: "fail" });
  } else {
    try {
      const hash = await bcrypt.hash(password, 4);
      const current = new Usermodel({ username, password: hash });
      await current.save();
      res.send({ msg: "Sign-up Successfull", status: "success" });
    } catch (err) {
      console.log(err);
      res.send({ msg: "Something went wrong", status: "error" });
    }
  }
});



// User login router

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ msg: "Complete your details", status: "fail" });
  }

  try {
    const user = await Usermodel.findOne({ username });

    if (user) {
      const hashed_password = user.password;
      const result = await bcrypt.compare(password, hashed_password);

      if (result) {
        const { token } = tokencreate(res, user._id);
        res.send({ msg: "Login Successfull", status: "success", token });
      } else {
        res.send({ msg: "Wrong Credentials", status: "fail" });
      }
    } else {
      res.send({ msg: "User not found", status: "fail" });
    }
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something went wrong", status: "error" });
  }
});


module.exports = userRouter;
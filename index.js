const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const  authentication  = require("./Backend/middleware/auth");
const connection = require("./Backend/configuration/db")
const userRouter  = require("./Backend/routes/userRoutes");
const eventRouter = require("./Backend/routes/eventRoutes");

app.get("/", (req, res) => {
    res.send({ msg: "Welcome" });
  });

  app.use("/user", userRouter);

  app.use(authentication)

  app.use("/event",eventRouter)

app.listen(process.env.port, async () => {
    try {
      await connection;
      console.log("Connected to db successfully");
      console.log(`Listening on port ${process.env.port}`);
    } catch (err) {
      console.log(err);
      console.log("Connection failed to db");
    }
  });
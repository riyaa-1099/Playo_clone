const express = require("express");



const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
const  authentication  = require("./Backend/middleware/auth");

const { userRouter } = require("./Backend/routes/userRoutes");

app.get("/", (req, res) => {
    res.send({ msg: "Welcome" });
  });

  app.use("/user", userRouter);

  app.use(authentication)

app.listen(7000, async () => {
    try {
      await connection;
      console.log("Connected to db successfully");
      console.log("Listening on port 7000");
    } catch (err) {
      console.log(err);
      console.log("Connection failed to db");
    }
  });
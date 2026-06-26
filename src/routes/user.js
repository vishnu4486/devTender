const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middelwares/auth");
const userRouter = express.Router();

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

module.exports = userRouter;

const express = require("express");
const { userAuth } = require("../middelwares/auth");
const User = require("../models/user");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

profileRouter.delete("/profile", userAuth, async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("Delete profile");
    const users = await User.findByIdAndDelete(userId);
    if (users) {
      res.send("Data delete sucess fully");
    } else {
      res.status(404).send("given data is not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

profileRouter.put("/profile/:userId", userAuth, async (req, res) => {
  try {
    console.log("Updated API");
    const _id = req.params?.userId;
    const { ...updateData } = req.body;
    const ALLOW_UPDATE = ["age", "skills", "photoUrl", "gender", "about"];

    const updateKeys = Object.keys(updateData);

    const UPDATE_FLAG = updateKeys.every((key) => ALLOW_UPDATE.includes(key));

    if (!UPDATE_FLAG) {
      return res.status(400).send("Updated not allowed");
    }
    const user = await User.findByIdAndUpdate(_id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) {
      res.status(404).send("User not found");
    }

    res.json({"message":"Profile updated successfuly",data:user});
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        error: error.message,
      });
    }
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

module.exports = profileRouter;

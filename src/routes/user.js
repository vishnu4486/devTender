const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middelwares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const SHOW_DATA = [
  "firstName",
  "lastName",
  "gender",
  "skills",
  "about",
  "photoUrl",
  "age",
];

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedIn = req.user;
    const page=parseInt(req.query.page)|| 1
    let limit=parseInt(req.query.limit) || 10
    limit = limit > 50 ? 50 :limit;
    const skip =(page-1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedIn._id },
        { toUserId: loggedIn._id },
      ],
    }).select("fromUserId toUserId");

    const hideUserList = new Set();

    connectionRequests.forEach((connection) => {
      hideUserList.add(connection.fromUserId.toString());
      hideUserList.add(connection.toUserId.toString());
    });

    const data = await User.find({
      _id: {
        $nin: Array.from(hideUserList),
      },
    }).select(SHOW_DATA).skip(skip).limit(limit);

    res.json({
      message: "fetch all userlist",
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/request/recived", userAuth, async (req, res) => {
  try {
    const _id = req.user._id;

    const data = await ConnectionRequest.find({
      toUserId: _id,
      status: "interested",
    }).populate("fromUserId", SHOW_DATA);
    res.json({ message: "data fetch sucessfully", data });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", SHOW_DATA).populate("toUserId", SHOW_DATA);

    const data = connectionRequest.map((connection) => {
      if (connection.fromUserId.toString() === loggedInUser._id.toString()) {
        return connection.toUserId
      }

      return connection.fromUserId
    });

    res.status(200).json({ message: "connection data fetch succefully", data });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
module.exports = userRouter;

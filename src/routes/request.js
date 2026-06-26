const express = require("express");
const { userAuth } = require("../middelwares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();
requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req, res) => {
        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;
             const user =User.findById(toUserId);
             if(!user){
                 return res.status(404).send("User not found : " + toUserId)
             }
            const allStatus = ["ignore", "interested"]
            if (!allStatus.includes(status)) {
                return res.status(400).send("your status is not correct : " + status)
            }
            const existingConnectionRequest = await ConnectionRequest.findOne({

                $or: [{ fromUserId, toUserId },
                {
                    fromUserId: toUserId, toUserId: fromUserId
                }
                ]
            })
            if (existingConnectionRequest) {
                return res.status(400).send("Request is alerady exist")
            }
            const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status })
            const data = await connectionRequest.save();
            res.json({
                message: "Connect Request sent Successfully",
                data
            });
        } catch (err) {
            res.status(400).send("ERROR: " + err.message);
        }
    },
);

module.exports = requestRouter;

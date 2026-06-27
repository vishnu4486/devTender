const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"//refrence to the user collection
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"//refrence to the user collection
    },
    status: {
        type: String,
        required:true,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: `{VALUE} is icorrect status type`,
        },
    },
}, {
    timestamps: true
});
connectionRequestSchema.index({fromUserId:1,toUserId:1})
connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;

   if( connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw  new Error ("Cannot send connection request to yourself")
    }
})
const ConnectionRequestModel = mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema,
);
module.exports = ConnectionRequestModel;

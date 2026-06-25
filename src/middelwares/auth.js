const User = require("../models/user");
const jwt = require("jsonwebtoken");
async function userAuth(req, res, next) {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is valid");
        }
        const decoded = await jwt.verify(token, "Dev@vsb");
        const { _id } = decoded;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User Not found");
        }
        req.user=user;
        next();
    } catch (err) {
        res.status(400).send("ERROR :" + err.message)
    }
}

module.exports = {
    userAuth
}
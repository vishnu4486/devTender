const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const { userAuth } = require("../middelwares/auth");
const authRouter = express.Router();
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHas = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHas,
    });

   const newUser= await user.save();
         const token = await newUser.getJWT();
      //Add the tocken to cookie and response back to the user
      res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

    res.status(201).json({
      message: "User added successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("invalid credentials");
    }
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // create a JWt Token
  
      const token = await user.getJWT();
      //Add the tocken to cookie and response back to the user
      res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
      res.status(200).json({message:"Login sucessfully",data:user});
    } else {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

authRouter.get("/logout", (req, res) => {
  res.clearCookie("token", null, {
    expires: new Date(Date.now()),
  });
  //  res.clearCookie("token");
  res.status(200).send("Log out succesfully !!!!");
});

authRouter.post("/forgot-password", userAuth, async (req, res) => {
  try {
    const { newPassword, conformPassword, oldPassword } = req.body;
    const user = req.user;

    const isPasswordValid = await user.validatePassword(oldPassword);

    if (!isPasswordValid) {
      throw new Error("Old password is incorrect.");
    }

    if (newPassword !== conformPassword) {
      throw new Error("Password does not match.");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    user.password = passwordHash;   // ✅ update password field
    await user.save();              // ✅ save user

    res.clearCookie("token");

    res.send("Password changed successfully. Please login again.");
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = authRouter;

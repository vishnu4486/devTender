const express = require("express");
const bcrypt = require("bcrypt");

const { connectDatabse } = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require('./middelwares/auth')
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.post("/login", async (req, res) => {
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
      // const token = await jwt.sign({ _id: user._id }, "Dev@vsb",{ expiresIn: '1h' });
      const token = await user.getJWT();
      //Add the tocken to cookie and response back to the user
      res.cookie("token", token,{expires: new Date(Date.now() + 7 *36000)});
      res.status(200).send("Login sucessfully");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user
    res.json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});
app.post("/signup", async (req, res) => {
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

    await user.save();
    res.status(201).json({
      message: "User added successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

app.delete("/user", userAuth, async (req, res) => {
  try {
    const { userId } = req.body;
    const users = await User.findByIdAndDelete(userId);
    if (users) {
      res.send("Datat delete sucess fully");
    } else {
      res.status(404).send("given data is not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});
app.put("/user/:userId", userAuth, async (req, res) => {
  try {
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
      return res.status(404).send("User not found");
    }

    res.send("Uodated user");
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

app.post("/user", userAuth, async (req, res) => {
  try {
    const { emailId } = req.body;
    const users = await User.findOne({ emailId });
    if (users) {
      res.json(users);
    } else {
      res.status(404).send("given data is not found");
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});
app.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

app.post("/sendConnectRequest",userAuth,(req,res)=>{
  const user=req.user;
res.send(user)

})
connectDatabse()
  .then((res) => {
    console.log("Database connected sucessfully");
    app.listen(PORT, () => {
      console.log(`App ringing in ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database not connected sucessfully");
  });

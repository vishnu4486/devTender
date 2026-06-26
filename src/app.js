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
const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const userRouter=require("./routes/user");
const requestRouter =require("./routes/request")
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",userRouter)
app.use("/",requestRouter)

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

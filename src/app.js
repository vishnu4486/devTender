const express = require("express");
const {adminAuth,userAuth} =require("./middelwares/auth")

const app = express();
const PORT = 3000
//its use middle ware

app.use("/user/login",(req, res, next) => {
    console.log("user login")
    next();
    //  res.send("Route Handler !!!!!!!!!!!!")
})
app.use("/user", userAuth,(req, res) => {
    console.log("Route2 first")
    res.send("Route 2 Handler !!!!!!!!!!!!")
})
app.use("/admin", adminAuth);
app.get("/admin/getallData", (req, res) => {

    res.send("fetch all data")

})
app.delete("/admin/getallData", (req, res) => {

    res.send("Delete the user")

})
app.listen(PORT, () => {
    console.log(`App ringing in ${PORT}`)
})
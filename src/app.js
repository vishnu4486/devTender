const express = require("express");

const app = express();
const PORT = 3000


app.use("/user", (req, res,next) => {
 console.log("Route first")
 next();
//  res.send("Route Handler !!!!!!!!!!!!")
},(req,res)=>{
    console.log("Rout2")
    res.send("Route2 Handler !!!!!!!!!!!!")



})

app.listen(PORT, () => {
    console.log(`App ringing in ${PORT}`)
})
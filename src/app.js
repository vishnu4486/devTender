const express = require("express");

const app = express();
const PORT = 3000


app.use("/home", (req, res) => {
    res.send("Home Page !!!!!!!!!!!!")
})
app.use("/about", (req, res) => {

    res.send("About page !!!!!!!!!!!!")
})
app.get("/user",(req,res)=>{
    res.send({name:"vishnu",lastname:"Biradar"})
})
app.post("/user",(req,res)=>{
    res.send("data save succsfully")
})
app.delete("/user",(req,res)=>{

    res.send("Delete user succefully")
})

// app.use("/",(req, res) => {

//     res.send("This is default page")
// })


app.listen(PORT, () => {
    console.log(`App ringing in ${PORT}`)
})
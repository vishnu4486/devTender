const express = require("express");

const app = express();
const PORT = 3000


app.use("/home",(req, res) => {
 res.send("Hello from server!!!!!!!!!!!!")
})
app.use("/about",(req, res) => {

    res.send("Hello from server!!!!!!!!!!!!")
})
app.use((req,res)=>{

    res.send("This is default page")
})

app.listen(PORT, () => {
    console.log(`App ringing in ${PORT}`)
})
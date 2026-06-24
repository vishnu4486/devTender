const express = require("express");
const app = express();
const PORT = 3000


app.get("/getUserDatat", (req, res) => {
    // try {
        throw new Error("sadjk jdsfs sajdfhasd ")
        res.send("User data")
    // } catch (err) {
    //     res.status(500).send("Somthing went  wrong This catch error")
    // }

})

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).send("Something went wrong");
});
app.use("/", (req, res, next) => {

         res.send("User data else ")
    
})
app.listen(PORT, () => {
    console.log(`App ringing in ${PORT}`)
})
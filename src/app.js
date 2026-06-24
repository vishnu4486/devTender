const express = require("express");
const { connectDatabse } = require("./config/database");
const User = require("./models/user");
const app = express();
const PORT = 3000

app.use(express.json());
app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;

        const user = new User({
            firstName,
            lastName,
            emailId,
            password
        });
        await user.save();
        res.status(201).json({
            message: "User added successfully",
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
});
app.post("/user", async (req, res) => {

    try {
        const { emailId } = req.body;
        // const users = await User.findOne({ emailId });
        const users = await User.find({ emailId });
        if (users) {


            res.json(users)
        } else {
            res.status(404).send("given data is not found")
        }
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});
connectDatabse().then((res) => {
    console.log("Database connected sucessfully")
    app.listen(PORT, () => {
        console.log(`App ringing in ${PORT}`)
    })
}).catch((err) => {

    console.log("Database not connected sucessfully")
})


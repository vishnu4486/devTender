const express = require("express");
const { connectDatabse } = require("./config/database");
const User = require("./models/user");
const app = express();
const PORT = 3000

// app.post("/signup", async (req, res) => {
//     try {
//         const doc = new User({ firstName: "vishnu ", lastName: "biradar", emailId: "vishnu@biradar.con", password: "vsb123" });
//         await doc.save();
//         res.send("User added  successfully");
//     } catch (error) {
//         console.error("Error saving document:", error);
//     }
// })
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
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
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


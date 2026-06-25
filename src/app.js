const express = require("express");
const { connectDatabse } = require("./config/database");
const User = require("./models/user");
const app = express();
const PORT = 3000

app.use(express.json());
app.post("/signup", async (req, res) => {
    try {
        // const { firstName, lastName, emailId, password } = req.body;
        const user = new User(req.body);
        await user.save();
        res.status(201).json({
            message: "User added successfully",
            data: user
        });
    } catch (error) {
        // console.error("test",error);
        // res.status(500).send("Something went wrong",error.message);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already exists",
                error: error.message,
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation failed",
                error: error.message,
            });
        }

        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });

    }
});
app.delete("/user", async (req, res) => {
    try {
        const { userId } = req.body;
        const users = await User.findByIdAndDelete(userId);
        if (users) {
            res.send("Datat delete sucess fully")
        } else {
            res.status(404).send("given data is not found")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }
})
app.put("/user/:userId", async (req, res) => {
    try {
        const _id = req.params?.userId
        const { ...updateData } = req.body;
        const ALLOW_UPDATE=["age","skills","photoUrl","gender","about"]

          const updateKeys = Object.keys(updateData);

          const UPDATE_FLAG = updateKeys.every(key => ALLOW_UPDATE.includes(key));
          console.log("UPDATE_FLAG",UPDATE_FLAG)
        if(!UPDATE_FLAG){
            return res.status(400).send("Updated not allowed")
        }
        const user = await User.findByIdAndUpdate(
            _id,
            updateData,
            { returnDocument: "after", runValidators: true }
        );

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

app.post("/user", async (req, res) => {
    try {
        const { emailId } = req.body;
        const users = await User.findOne({ emailId });
        // const users = await User.find({ emailId });
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


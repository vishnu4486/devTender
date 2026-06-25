const mongoose = require('mongoose')
let validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

const userSchema = new Schema({

    firstName: {
        type: String,
        required: true,
        minLength: 3
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Given Email is not valid.", value);
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "femal", "other"].includes(value)) {
                throw new Error("Gender value is not valid")
            }
        }
    },
    skills: {
        type: [String],
        validate(value) {
            if (value.length > 10) {
                throw new Error("A user can have a maximum of 10 skills.");
            }
        }
    },
    about: {
        type: String,
        default: "This default containt"
    },
    photoUrl: {
        type: String,
        default: "https://api.dicebear.com/9.x/adventurer/svg?seed=User"
    }
}, { timestamps: true });

userSchema.methods.getJWT = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id }, "Dev@vsb", { expiresIn: '1h' });
    return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password);
    return isPasswordValid;

}
const User = mongoose.model("User", userSchema)
module.exports = User
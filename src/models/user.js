const mongoose = require('mongoose')
let validator = require('validator');
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

const User = mongoose.model("User", userSchema)
module.exports = User
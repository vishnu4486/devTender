const validator = require("validator");

function validateSignUpData(req) {
    const { firstName, lastName, emailId, password } = req.body;

    // Check required fields
    if (!firstName || !lastName || !emailId || !password) {
        throw new Error("All fields are required.");
    }

    // Validate first name
    if (!validator.isLength(firstName, { min: 2, max: 50 })) {
        throw new Error("First name must be between 2 and 50 characters.");
    }

    // Validate last name
    if (!validator.isLength(lastName, { min: 2, max: 50 })) {
        throw new Error("Last name must be between 2 and 50 characters.");
    }

    // Validate email
    if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email address.");
    }

    // Validate password
    if (!validator.isStrongPassword(password)) {
        throw new Error(
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        );
    }
}

module.exports = {
    validateSignUpData,
};
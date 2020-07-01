const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.methods.generateAuthToken = () => {
    const token = jwt.sign({ _id: this._id }, process.env.jwtprivateKey);
    return token;
};

const User = new mongoose.model("User", userSchema, "Users");

module.exports.User = User;

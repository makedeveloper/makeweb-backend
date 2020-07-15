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
    github: {
        type: String,
        validate: {
            validator: function (v) {
                return (
                    v.length > 0 &&
                    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
                        v
                    )
                );
            },
            message: "Github profile link must be a valid URL",
        },
    },
    linkedIn: {
        type: String,
        validate: {
            validator: function (v) {
                return (
                    v.length > 0 &&
                    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
                        v
                    )
                );
            },
            message: "LinkedIn profile link must be a valid URL",
        },
    },
    stacks: {
        type: Array,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: "A project must have atleast one stack.",
        },
    },
    fieldOfStudy: {
        type: Array,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: "A project must have atleast one field of study.",
        },
    },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.jwtprivateKey);
    return token;
};

const User = new mongoose.model("User", userSchema, "Users");

module.exports.User = User;

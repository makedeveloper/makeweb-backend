const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    isInitiated: {
        type: Boolean,
        required: true,
    },
    link: {
        type: String,
        required: function () {
            this.isInitiated;
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
    lookingFor: {
        type: String,
        enum: ["mentor", "mentee", "both", "none"],
        required: true,
    },
    idea: {
        type: String,
        requried: true,
    },
});

const Project = mongoose.model("Project", projectSchema, "Projects");

module.exports.Project = Project;

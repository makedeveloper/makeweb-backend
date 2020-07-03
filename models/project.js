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
        required: function () { this.isInitiated }
    },
    stacks: {
        type: String,
        required: true,
    },
    fieldOfStudy: {
        type: String,
        required: true,
    },
    lookingFor: {
        type: String,
        enum: ["mentor", "student", "both"],
        required: true,
    },
    idea: {
        type: String,
        requried: true,
    },
});

const Project = mongoose.model("Project", projectSchema, "Projects");

module.exports.Project = Project;

const mongoose = require("mongoose");

const collaboratorDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    stacks: {
        type: Array,
        required: true,
        default: undefined,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: "Atleast one stack must be provided",
        },
    },
    fieldOfStudy: {
        type: Array,
        required: true,
        default: undefined,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: "Atleast one field of study must be provided",
        },
    },
    experienceLevel: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    note: {
        type: String,
    },
});

const CollaborationRequest = mongoose.model("CollaborationRequest", collaboratorDetailsSchema, "Collaboration Requests");

const collaboratorSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Project",
        unique: true,
        required: true,
    },
    mentors: [collaboratorDetailsSchema],
    mentees: [collaboratorDetailsSchema],
});

const Collaborator = mongoose.model(
    "Collaborator",
    collaboratorSchema,
    "Collaborators"
);

module.exports.Collaborator = Collaborator;
module.exports.CollaborationRequest = CollaborationRequest;

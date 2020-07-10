const mongoose = require("mongoose");
const { date } = require("@hapi/joi");

const commentSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Project",
        unique: true,
        required: true,
    },

    comments: [{
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: "User",
        },
        comment: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now()
        }
    }]
})

const Comment = new mongoose.model("Comment", commentSchema, "Comments");

module.exports.Comment = Comment;
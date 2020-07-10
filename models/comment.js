const mongoose = require("mongoose");

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
            required: true
            // default: Date.now()
        }
    }]
})

// function getDate() {
//     let d = new Date();
//     let timestamp = d.toLocaleString();
//     return timestamp;
// }

const Comment = new mongoose.model("Comment", commentSchema, "Comments");

module.exports.Comment = Comment;
const express = require("express");
const mongoose = require('mongoose');
const Joi = require("@hapi/joi");
Joi.objectid = require("joi-objectid")(Joi);
const _ = require("lodash");

const userAuth = require("../middleware/userAuth");
const { Comment } = require("../models/comment");
const { Project } = require("../models/project");

const router = express.Router();

function validateComment(body) {
    const schema = Joi.object({
        comment: Joi.string().required().label("Comment"),
        timestamp: Joi.date().required().label("Timestamp"),
        projectId: Joi.objectid().required().label("Project ID"),
    });

    return schema.validate(body);
}

router.post('/:projectId', userAuth, async(req, res) => {
    const { error } = validateComment({...req.body, projectId: req.params.projectId});
    if (error) return res.status(400).send(error.details[0].message);

    let doesProjectExist = await Project.findById(req.params.projectId);
    if (!doesProjectExist)
        return res
            .status(400)
            .send(`Project with ID: ${req.body.projectId} does not exist`);

    let comment = await Comment.findOne({projectId: req.params.projectId});

    if (!comment) {
        comment = new Comment({
            projectId: req.params.projectId
        });

        await comment.save();
    }

    await Comment.findByIdAndUpdate(comment._id, {
        $push: {
            comments: {
                userId: req.user._id,
                comment: req.body.comment,
                timestamp: req.body.timestamp
            }
        }
    });

    res.status(201).send();
})

module.exports = router;
const express = require("express");
const Joi = require("@hapi/joi");
Joi.objectid = require("joi-objectid")(Joi);
const _ = require("lodash");

const user_auth = require("../middleware/userAuth");
const {
    Collaborator,
    CollaborationRequest,
} = require("../models/collaborator");
const { Project } = require("../models/project");

const router = express.Router();

function validateJoiningData(body) {
    const schema = Joi.object({
        stacks: Joi.array().min(1).required().label("Stacks"),
        fieldOfStudy: Joi.array().min(1).required().label("Fields of study"),
        experienceLevel: Joi.number()
            .min(1)
            .max(5)
            .required()
            .label("Experience level"),
        projectId: Joi.objectid().required().label("Project ID"),
        joinAs: Joi.string()
            .valid("mentor", "mentee")
            .required()
            .label("Join As [mentor | mentee]"),
        note: Joi.string().min(1).optional(),
    });

    return schema.validate(body);
}

function validateJoinRequestData(body) {
    const schema = Joi.object({
        stacks: Joi.array().min(1).required().label("Stacks"),
        fieldOfStudy: Joi.array().min(1).required().label("Fields of study"),
        experienceLevel: Joi.number()
            .min(1)
            .max(5)
            .required()
            .label("Experience level"),
        joinAs: Joi.string()
            .valid("mentor", "mentee")
            .required()
            .label("Join As [mentor | mentee]"),
        note: Joi.string().min(1).optional(),
    });

    return schema.validate(body);
}

router.post("/join", user_auth, async (req, res) => {
    const { error } = validateJoiningData(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let doesProjectExist = await Project.findById(req.body.projectId);
    if (!doesProjectExist)
        return res
            .status(400)
            .send(`Project with ID: ${req.body.projectId} does not exist`);
    
    if (doesProjectExist.lookingFor === "none")
        return res.status(400).send("This project is currently not accepting collaborators")
    if (req.body.joinAs === "mentor" && doesProjectExist.lookingFor === "mentee")
        return res.status(400).send("This project is currently not accepting mentors")
    if (req.body.joinAs === "mentee" && doesProjectExist.lookingFor === "mentor")
        return res.status(400).send("This project is currently not accepting mentees")

    let project = await Collaborator.findOne({
        projectId: req.body.projectId,
    });

    if (!project) {
        project = new Collaborator({
            projectId: req.body.projectId,
        });

        await project.save();
    }

    const collaborator = _.pick(req.body, [
        "stacks",
        "fieldOfStudy",
        "experienceLevel",
        "note",
    ]);
    collaborator.userId = req.user._id;

    if (req.body.joinAs === "mentor") {
        await Collaborator.findByIdAndUpdate(
            project._id,
            {
                $push: {
                    mentors: collaborator,
                },
            },
            { new: true }
        );
    } else {
        await Collaborator.findByIdAndUpdate(
            project._id,
            {
                $push: {
                    mentees: collaborator,
                },
            },
            { new: true }
        );
    }

    return res.status(201).send();
});

router.post("/request", user_auth, async (req, res) => {
    const { error } = validateJoinRequestData(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let collaborationRequest = new CollaborationRequest(
        _.pick(req.body, [
            "stacks",
            "fieldOfStudy",
            "experienceLevel",
            "joinAs",
            "note",
        ])
    );
    collaborationRequest.userId = req.user._id;

    await collaborationRequest.save();

    res.status(201).send();
});

module.exports = router;

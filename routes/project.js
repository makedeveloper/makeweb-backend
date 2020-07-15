const express = require("express");
const mongoose = require("mongoose");
const winston = require("winston");
const Joi = require("@hapi/joi");
const _ = require("lodash");

const userAuth = require("../middleware/userAuth");
const { Project } = require("../models/project");
const { Comment } = require("../models/comment");
const { Collaborator } = require("../models/collaborator");

const router = express.Router();

function validateNewProject(body) {
    const postSchema = Joi.object({
        name: Joi.string().required().label("Project Name"),
        isInitiated: Joi.boolean()
            .required()
            .label("Project Started ? [True / False]"),
        link: Joi.string()
            .when("isInitiated", {
                is: false,
                then: Joi.forbidden(),
                otherwise: Joi.required(),
            })
            .label("Project Link"),
        stacks: Joi.array().min(1).required().label("Stacks in use"),
        fieldOfStudy: Joi.array().min(1).required().label("Field of Study"),
        lookingFor: Joi.string()
            .required()
            .valid("mentor", "mentee", "both", "none")
            .label("Looking For"),
        idea: Joi.string().required().label("Project Idea"),
    });

    return postSchema.validate(body);
}

router.get("/", userAuth, async (req, res) => {
    const projects = await Project.find({ userId: req.user._id });
    
    const collabs = await Collaborator.find().populate('projectId');
    
    let userProjects = {
        owner: projects,
        mentor: [],
        mentee: []
    }

    collabs.forEach(collab => {
        collab.mentors.forEach(mentor => {
            if (mentor.userId == req.user._id) {
                userProjects.mentor.push(collab.projectId);
            }
        })
        collab.mentees.forEach(mentee => {
            if (mentee.userId == req.user._id) {
                userProjects.mentee.push(collab.projectId);
            }
        })
    })

    res.send(userProjects)
});

router.get("/all", async (req, res) => {
    const projects = await Project.find()
        .select("name stacks idea")
        .sort("name");
    res.send(projects);
});

router.get("/:projectId", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.projectId))
        return res
            .status(400)
            .send(`${req.params.projectId} is not a valid ID`);

    const project = await Project.findById(req.params.projectId).populate(
        "userId",
        "fullname username"
    );
    if (!project)
        return res
            .status(400)
            .send(
                `ID ${req.params.projectId} is not associated with any project`
            );

    let projectDetails = {...project._doc};
    projectDetails.owner = project.userId;
    delete projectDetails.userId;

    const comments = await Comment.findOne({
        projectId: req.params.projectId,
    }).populate({
        path: "comments.userId",
        select: "username",
    });

    const collaborators = await Collaborator.findOne({
        projectId: req.params.projectId,
    }).populate({
        path: "mentors.userId mentees.userId",
        select: "username fullname",
    });

    const data = {
        projectDetails: projectDetails,
        comments: [],
        mentors: [],
        mentees: [],
    };

    if (comments) {
        comments.comments.forEach((elem) => {
            let comment = {
                comment: elem.comment,
                timestamp: elem.timestamp,
                username: elem.userId.username,
            };
            data.comments.push(comment);
        });
    }

    if (collaborators) {
        collaborators.mentors.forEach((elem) => {
            let mentor = {
                username: elem.userId.username,
            };
            data.mentors.push(mentor);
        });

        collaborators.mentees.forEach((elem) => {
            let mentee = {
                username: elem.userId.username,
            };
            data.mentees.push(mentee);
        });
    }

    res.send(data);
});

router.post("/new", userAuth, async (req, res) => {
    const { error } = validateNewProject(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const project = new Project(
        _.pick(req.body, [
            "name",
            "isInitiated",
            "link",
            "stacks",
            "fieldOfStudy",
            "lookingFor",
            "idea",
        ])
    );
    project.userId = req.user._id;

    await project.save();
    return res.status(201).send(project._id);
});

module.exports = router;

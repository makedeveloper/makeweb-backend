const express = require("express");
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const _ = require('lodash');

const user_auth = require("../middleware/userAuth");
const { User } = require("../models/user");

const router = express.Router();

function validateProfileData(body) {
    const schema = Joi.object({
        fullname: Joi.string().required().label("Full name"),
        username: Joi.string().required().label("Username"),
        email: Joi.string().email().required().label("Email ID"),
        github: Joi.string().uri().optional().label("Github profile link"),
        linkedIn: Joi.string().uri().optional().label("Linkedin profile link"),
        stacks: Joi.array().min(1).required().label("Stacks in use"),
        fieldOfStudy: Joi.array().min(1).required().label("Field of Study"),
    });

    return schema.validate(body);
}


router.get('/:id', user_auth, async(req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    res.send(user);
})

router.post("/", user_auth, async (req, res) => {
    const { error } = validateProfileData(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const profile = _.pick(req.body, ['fullname', 'username', 'email', 'stacks', 'fieldOfStudy', 'github', 'linkedIn']);
    const removed = {};

    if (!profile.github)
        removed.github = 1;
    if (!profile.linkedIn)
        removed.linkedIn = 1;
    
    await User.findByIdAndUpdate(req.user._id, {
        $set: profile,
        $unset: removed
    });

    res.status(201).send();
});

module.exports = router;
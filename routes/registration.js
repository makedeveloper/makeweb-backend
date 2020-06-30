const express = require("express");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

const { User } = require("../models/user");

const router = express.Router();

function validateRegData(body) {
    const regSchema = Joi.object({
        fullname: Joi.string().required().label("Full name"),
        username: Joi.string().required().label("Username"),
        email: Joi.string().email().required().label("Email ID"),
        password: Joi.string().required().label("Password"),
        confirm_password: Joi.string()
            .required()
            .label("Password Confirmation"),
    });

    return regSchema.validate(body);
}

router.post("/", async (req, res) => {
    const { error } = validateRegData(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (req.body.password !== req.body.confirm_password)
        return res.status(400).send("Passwords do not match");

    let user = await User.findOne({ email: req.body.email });
    if (user)
        return res
            .status(400)
            .send("This email is already associated with another account");

    user = await User.findOne({ username: req.body.username });
    if (user)
        return res
            .status(400)
            .send("This username is not available");

    user = new User(_.pick(req.body, ["fullname", "username", "email"]));

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPwd;

    try {
        await user.save();
        res.send({ token: user.generateAuthToken(), userId: user._id });
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;

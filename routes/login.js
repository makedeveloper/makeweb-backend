const express = require("express");
const bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");

const { User } = require("../models/user");

const router = express.Router();

function validateLoginData(body) {
    const loginSchema = Joi.object({
        email: Joi.string().email().allow("").label("Email ID"),
        username: Joi.string().allow("").label("Username"),
        password: Joi.string().required().label("Password"),
    });

    return loginSchema.validate(body);
}

router.post("/", async (req, res) => {
    const { error } = validateLoginData(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (!req.body.email && !req.body.username) return res.status(400).send("Email address/username is required");

    const errorParam = req.body.email ? "email address" : "username";

    const user = await User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.username }],
    });
    if (!user) return res.status(400).send(`Invalid ${errorParam} or password`);

    const validPwd = await bcrypt.compare(req.body.password, user.password);
    if (!validPwd)
        return res.status(400).send(`Invalid ${errorParam} or password`);

    return res.send({
        "x-auth-token": user.generateAuthToken(),
        userId: user._id,
    });
});

module.exports = router;

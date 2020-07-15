const express = require("express");
const cors = require("cors");

const error = require('../middleware/error');

const registration = require('../routes/registration')
const login = require('../routes/login')
const project = require('../routes/project');
const collaborator = require('../routes/collaborator');
const comment = require('../routes/comment');
const profile = require('../routes/profile');

module.exports = function (app) {
    app.use(express.json());
    app.use(cors());

    app.use("/register", registration);
    app.use("/login", login);
    app.use("/project", project);
    app.use("/collaborator", collaborator);
    app.use("/comment", comment);
    app.use("/profile", profile);

    app.use(error);
};

const express = require("express");

const error = require('../middleware/error');

const registration = require('../routes/registration')
const login = require('../routes/login')
const project = require('../routes/project');

module.exports = function (app) {
    app.use(express.json());
    app.use("/register", registration);
    app.use("/login", login);
    app.use("/project", project);
    app.use(error);
};

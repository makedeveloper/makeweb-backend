const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
    mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost/makedeveloper", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => winston.info("MongoDB connected"));
}
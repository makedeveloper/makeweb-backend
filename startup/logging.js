const winston = require("winston");
require("express-async-errors");

module.exports = function () {
    winston.exceptions.handle(
        new winston.transports.Console({
            format: winston.format.prettyPrint(),
        }),
        new winston.transports.File({
            filename: "./log/uncaughtExceptions.log",
        })
    );

    process.on("unhandledRejection", (ex) => {
        throw ex;
    });

    winston.add(
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(winston.format.prettyPrint()),
        })
    );
    winston.add(
        new winston.transports.File({
            filename: "./log/logfile.log",
            level: "warn",
            format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
        })
    );
};

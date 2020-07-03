const winston = require("winston");
require("express-async-errors");

module.exports = function () {
    winston.exceptions.handle(
        new winston.transports.Console({ prettyPrint: true }),
        new winston.transports.File({
            filename: "./log/uncaughtExceptions.log",
        })
    );

    process.on("unhandledRejection", (ex) => {
        throw ex;
    });

    winston.add(
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(winston.format.prettyPrint()),
        })
    );
    winston.add(
        new winston.transports.File({
            filename: "./log/logfile.log",
            level: "warn",
            format: winston.format.combine(winston.format.prettyPrint()),
        })
    );
};

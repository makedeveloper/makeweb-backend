const winston = require("winston");

module.exports = function (err, req, res, next) {
    winston.error(err.message, err);
    if (err.errors) {
        let errors = [];
        for (let i=0; i<Object.keys(err.errors).length; i++) {
            errors.push(err.errors[Object.keys(err.errors)[i]].message)
        }
        res.status(500).send(errors);
    } else if (err.message) res.status(500).send(err.message);
    else res.status(500).send("Internal server error occurred");
};

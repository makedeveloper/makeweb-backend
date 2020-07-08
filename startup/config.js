const winston = require('winston');

module.exports = function () {
    if (!process.env.jwtPrivateKey) {
        winston.error("Fatal Error: Private key not set. Shutting down server");
        process.exit(1);
    }
};

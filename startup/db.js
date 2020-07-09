const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function () {
    winston.info("Connecting to MongoDB...");
    mongoose
        .connect(
            process.env.MONGODB_URI || "mongodb://localhost/makedeveloper",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
        .then(() => winston.info("MongoDB connected"))
        .catch(() => {
            winston.error("Could not connect to MongoDB");
            process.exit(0);
        });
};

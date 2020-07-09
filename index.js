const express = require("express");
const winston = require("winston");

const app = express();

require('./startup/logging')();
require('./startup/config')();

const port = process.env.PORT || 4500;
app.listen(port, () => {
    winston.info(`Express server started at port ${port}`);
});

require('./startup/db')();
require('./startup/routes')(app);
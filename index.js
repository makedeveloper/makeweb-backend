const express = require("express");
const winston = require("winston");

const app = express();

require('./startup/logging')();
require('./startup/db')();
require('./startup/config')();
require('./startup/routes')(app);

const port = process.env.PORT || 4500;
app.listen(port, () => {
    winston.info(`Express server started at port ${port}`);
});

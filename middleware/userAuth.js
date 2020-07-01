const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const x_auth_token = req.header("x-auth-token");
    if(!x_auth_token) return res.status(401).send("Access denied. No token provided");

    try {
        const token = jwt.verify(x_auth_token, process.env.jwtPrivateKey);
        req.user = token;
        next()
    } catch {
        res.status(400).send("Corrupt auth token received");
    }
}

module.exports = auth;
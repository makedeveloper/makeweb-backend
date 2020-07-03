module.exports = function () {
    if (!process.env.jwtPrivateKey) {
        throw new Error("Private key not set. Shutting down server");
    }
};

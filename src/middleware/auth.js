const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const bearer = req.headers.authorization;

        if (!bearer) {
            const error = new Error("Not Authorized!");
            error.statusCode = 401;
            throw error;
        }

        const token = bearer.split(" ")[1];
        if (!token) {
            const error = new Error("No valid token!");
            error.statusCode = 401;
            throw error;
        }

        const user = jwt.verify(token, process.env.JWT_KEY);
        req.userId = user.userId;

        next();
    } catch (error) {
        next(error);
    }
};

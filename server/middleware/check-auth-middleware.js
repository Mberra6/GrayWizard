require('dotenv').config(); // Load environment variables from .env file
const jwt = require('jsonwebtoken'); // Import jsonwebtoken library for working with JWTs

// Check if user is authenticated
exports.auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.SESSION_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid!");
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json("You are not authenticated!");
    }
};

// Explicit endpoint for /user/auth
exports.authCheckHandler = (req, res) => {
    const { id } = req.user;
    res.status(200).json({ id });
};

require('dotenv').config(); // Load environment variables from .env file
const jwt = require('jsonwebtoken'); // Import jsonwebtoken library for working with JWTs

// Middleware to check if user is authenticated
exports.auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1]; // Extract token from authorization header

        jwt.verify(token, process.env.SESSION_SECRET, (err, user) => { // Verify token validity
            if (err) {
                return res.status(403).json("Token is not valid!"); // If token is invalid, return error response
            }

            req.user = user; // Set user details in request object
            res.status(200).json("You are authenticated"); // Return success response
            next(); // Move to next middleware or route handler
        });
    } else {
        res.status(401).json("You are not authenticated!"); // If no authorization header present, return unauthorized response
    }
};

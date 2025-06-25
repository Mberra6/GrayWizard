require('dotenv').config(); // Load environment variables from .env file

const express = require('express'); // Import Express framework
const cors = require('cors'); // Import CORS middleware

const checkAuth = require('./middleware/check-auth-middleware');
const genRoutes = require('./routes/general_routes'); // Import general routes
const authRoutes = require('./routes/auth_routes'); // Import authentication routes

const app = express(); // Create Express app instance

const allowedOrigins = [
    process.env.ORIGIN_URL_PROD,
    process.env.ORIGIN_URL_DEV,
];
// Enable CORS with credentials and specific origins
app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for this origin'));
      }
    },
    credentials: true
}));

app.use(express.json()); // Parse JSON bodies in the request object
app.use(express.urlencoded({ extended: true }));

// Redirect requests to endpoints starting with '/' to general-routes.js
app.use('/api/', genRoutes);
// Redirect requests to endpoints starting with '/member' to auth-routes.js
app.use('/api/member', checkAuth.auth, authRoutes);

app.listen(process.env.SERVER_PORT, () => console.log(`Server running on http://localhost:${process.env.SERVER_PORT}`)); // Start the server and listen for requests on specified port

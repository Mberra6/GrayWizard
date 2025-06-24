const express = require('express'); // Import Express framework

const checkAuth = require('../middleware/check-auth-middleware'); // Import middleware to check authentication
const userControllers = require('../controllers/users_controller'); // Import user controller functions

const router = express.Router(); // Create Express router instance

// Route to check if user is authorized
router.get('/auth', checkAuth.auth);

// Route to get user's details
router.get('/account/:userId', userControllers.userDetails);

// Route to update user's details
router.put('/account/update/:userId', userControllers.userUpdateDetails);

// Route to change user's password
router.put('/account/changepassword/:userId', userControllers.userChangePassword);

module.exports = router; // Export router instance

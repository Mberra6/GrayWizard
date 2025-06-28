const express = require('express'); // Import Express framework

const checkAuth = require('../middleware/check-auth-middleware'); // Import middleware to check authentication
const userControllers = require('../controllers/users_controller'); // Import user controller functions

const router = express.Router(); // Create Express router instance

// Route to check if user is authorized
router.get('/auth', checkAuth.authCheckHandler);

// Route to get user's details
router.get('/account/:userId', userControllers.userDetails);

// Route to update user's email
router.put('/account/update/email/:userId', userControllers.userUpdateEmail);

// Route to update user's username
router.put('/account/update/username/:userId', userControllers.userUpdateUsername);

// Route to update user's first name
router.put('/account/update/first-name/:userId', userControllers.userUpdateFirstName);

// Route to update user's last name
router.put('/account/update/last-name/:userId', userControllers.userUpdateLastName);

// Route to change user's password
router.put('/account/update/password/:userId', userControllers.userChangePassword);

module.exports = router; // Export router instance

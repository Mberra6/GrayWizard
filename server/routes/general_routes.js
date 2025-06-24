const express = require('express'); // Import Express framework
const userControllers = require('../controllers/users_controller'); // Import user controller functions
const { encryptText, decryptText } = require('../controllers/crypto_controller'); // Import encryption and decryption controller functions
const { assessStrength } = require('../controllers/password_strength_controller'); // Import password strength checker controller function

const router = express.Router(); // Create Express router instance

// Route to register a new user
router.post('/register', userControllers.userRegister);

// Route to login a user
router.post('/login', userControllers.userLogin);

// Route to encrypt text
router.post('/encrypt', encryptText);

// Route to decrypt text
router.post('/decrypt', decryptText);

// Route to decrypt text
router.post('/passwordStrength', assessStrength);

module.exports = router; // Export router instance

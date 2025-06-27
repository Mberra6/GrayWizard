require('dotenv').config(); // Load environment variables from .env file
const Members = require('../models/members'); // Import Members model for interacting with the database
const jwt = require('jsonwebtoken'); // Import jsonwebtoken library for generating JWTs

// Function to check if passwords match
const checkPasswords = (passwordOne, passwordTwo) => {
    if (passwordOne === passwordTwo) return true;
    return false;
};

// Function to check if emails match
const checkEmails = (emailOne, emailTwo) => {
    if (emailOne.toLowerCase() === emailTwo.toLowerCase()) return true;
    return false;
};

// Function to check if username exists in the database
const doesExistUsername = async (username) => {
    try {
        let [member, _] = await Members.findByUsername(username);
        if (member.length > 0) {
            return true; // Username exists
        } else {
            return false; // Username does not exist
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Function to check if username exists in the database (for update profile)
const doesExistUsernameUpdate = async (username, id) => {
    try {
        let [member, _] = await Members.findByUsernameUpdate(username, id);
        if (member.length > 0) {
            return true; // Username exists
        } else {
            return false; // Username does not exist
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Function to check if email exists in the database
const doesExistEmail = async (email) => {
    try {
        let [member, _] = await Members.findByEmail(email);
        if (member.length > 0) {
            return true; // Email exists
        } else {
            return false; // Email does not exist
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Function to check if email exists in the database (for update profile)
const doesExistEmailUpdate = async (email, id) => {
    try {
        let [member, _] = await Members.findByEmailUpdate(email, id);
        if (member.length > 0) {
            return true; // Email exists
        } else {
            return false; // Email does not exist
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Function to check if username and password pair exist in the database
const authenticateUserByUsername = async (username, password) => {
    try {
        let [member, _] = await Members.findByUsername(username);
        if (member.length > 0) return member[0].password === password; // Returns true if password matches
        return false; // Username not found or password doesn't match
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Function to check if email and password pair exist in the database
const authenticateUserByEmail = async (email, password) => {
    try {
        let [member, _] = await Members.findByEmail(email);
        if (member.length > 0) return member[0].password === password; // Returns true if password matches
        return false; // Email not found or password doesn't match
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Function to check if password entered in changePassword form matches existing user password
const authenticateUserById = async (id, password) => {
    try {
        let [member, _] = await Members.findById(id);
        if (member.length > 0) return member[0].password === password; // Returns true if password matches
        return false; // User ID not found or password doesn't match
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Function to generate JSON Web Token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user.member_id, username: user.username}, process.env.SESSION_SECRET, { expiresIn: "24h" }); // Generate JWT with user details and expiration time
};

// Function to register a new user
exports.userRegister = async (req, res, next) => {
    try {
        let { username, email, firstName, lastName, password, repeatPassword } = req.body;
        
        // Validate user input
        if (firstName.trim().length === 0 || lastName.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0 || repeatPassword.trim().length === 0 || username.trim().length === 0) {
            res.status(403).json({ message: 'Fields cannot be left blank!' });
        } else if (await doesExistUsername(username)) {
            res.status(403).json({ message: 'Username already exists!' });
        } else if (/\s/g.test(username.trim())) {
            res.status(403).json({ message: 'Username cannot contain white spaces!' });
        } else if (await doesExistEmail(email)) {
            res.status(403).json({ message: 'Email already exists! Please choose a different email' });
        } else if (password.length < 8) {
            res.status(403).json({ message: "Password must be at least 8 characters long!" });
        } else if (!checkPasswords(password, repeatPassword)) {
            res.status(403).json({ message: "Passwords do not match!" });
        } else {
            // Create a new member object and save it to the database
            let member = new Members(username.replace(/\s+/g, ' ').trim(), email.replace(/\s+/g, ' ').trim(), firstName.replace(/\s+/g, ' ').trim(), lastName.replace(/\s+/g, ' ').trim(), password.replace(/\s+/g, ' ').trim());
            member = await member.save();
            res.status(201).json({ message: 'Registration successful. You can now login.'});
        }
        
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Function to log in a user
exports.userLogin = async (req, res, next) => {
    try {
        let { email, username, password } = req.body;

        if (await authenticateUserByEmail(email, password)) {
            let [member, _] = await Members.findByEmail(email);
            const accessToken = generateAccessToken(member[0]); // Generate access token for the user

            return res.status(201).json({
                accessToken: accessToken
            });
        } else if (await authenticateUserByUsername(username, password)) {
            let [member, _] = await Members.findByUsername(username);
            const accessToken = generateAccessToken(member[0]); // Generate access token for the user

            return res.status(201).json({
                accessToken: accessToken
            });
        } else {
            return res.status(403).json({ message: 'Invalid authentication. Check your credentials.' });
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Function to get user details
exports.userDetails = async (req, res, next) => {
    try {
        let id = req.params.userId;
        let [member, _] = await Members.findById(id);

        res.status(200).json({member});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

// Function to update user details
exports.userUpdateDetails = async (req, res, next) => {
    try {
        let id = req.params.userId;
        let { username, email, confirmationEmail, firstName, lastName } = req.body;

        if (!checkEmails(email, confirmationEmail)) {
            res.status(403).json({ message: "Emails do not match!" });
        } else if (await doesExistEmailUpdate(email, id)) {
            res.status(403).json({ message: 'Email already exists! Please choose a different email' });
        } else if (await doesExistUsernameUpdate(username, id)) {
            res.status(403).json({ message: 'Username already exists!' });
        } else {
            await Members.updateById(id, firstName, lastName, email, username); // Update user details in the database
            res.status(200).json({message: "Details successfully updated!"});
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
}

// Function to change user password
exports.userChangePassword = async (req, res, next) => {
    try {
        let id = req.params.userId;
        let { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (! await authenticateUserById(id, currentPassword)) {
            res.status(403).json({ message: "Incorrect Password!" });
        } else if (newPassword !== confirmNewPassword) {
            res.status(403).json({ message: 'Passwords do not match!' });
        } else if (newPassword.length < 8) {
            res.status(403).json({ message: "Password must be at least 8 characters long!" });
        } else {
            await Members.updatePasswordById(id, newPassword); // Update user password in the database
            res.status(200).json({message: "Password successfully updated!"});
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
}

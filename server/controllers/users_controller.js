require('dotenv').config(); // Load environment variables from .env file
const Members = require('../models/members'); // Import Members model for interacting with the database
const jwt = require('jsonwebtoken'); // Import jsonwebtoken library for generating JWTs
const validator = require('validator');

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
        let { username, email, firstName, lastName } = req.body;

        if (await doesExistEmailUpdate(email, id)) {
            res.status(403).json({ message: 'Email already exists! Please choose a different email' });
        } else if (await doesExistUsernameUpdate(username, id)) {
            res.status(403).json({ message: 'Username already exists! Please choose a different username' });
        } else if (/\s/g.test(username.trim())) {
            res.status(403).json({ message: 'Username cannot contain white spaces!' });
        } else {
            await Members.updateById(id, firstName, lastName, email, username); // Update user details in the database
            res.status(200).json({message: "Details successfully updated!"});
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
}

// Function to update username 
exports.userUpdateUsername = async (req, res, next) => {
    try {
        let id = req.params.userId;
        let { username } = req.body;

        // Trim + sanitize
        username = validator.escape(username.trim());

        if (!username) {
            return res.status(400).json({ message: 'Username cannot be empty.' });
        } else if (username.length > 30) {
            return res.status(403).json({ message: 'Username too long (max 30 characters).' });
        } else if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
            return res.status(403).json({ message: 'Username contains invalid characters.' });
        } else if (await doesExistUsernameUpdate(username, id)) {
            return res.status(403).json({ message: 'Username already exists! Please choose a different username' });
        }

        await Members.updateUsernameById(id, username);
        res.status(200).json({ message: "Username successfully updated!" });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

// Function to update email
exports.userUpdateEmail = async (req, res, next) => {
    try {
        let id = req.params.userId;
        let { email } = req.body;

        email = validator.normalizeEmail(email.trim());

        if (!email) {
            return res.status(400).json({ message: 'Email cannot be empty.' });
        } else if (!validator.isEmail(email)) {
            return res.status(403).json({ message: 'Invalid email format!' });
        } else if (await doesExistEmailUpdate(email, id)) {
            return res.status(403).json({ message: 'Email already exists! Please choose a different email' });
        }

        await Members.updateEmailById(id, email);
        res.status(200).json({ message: "Email successfully updated!" });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Function to update first name 
exports.userUpdateFirstName = async (req, res, next) => {
    try {
        let id = req.params.userId;
        let { first_name } = req.body;

        first_name = validator.escape(first_name.trim());

        if (!first_name) {
            return res.status(400).json({ message: 'First name cannot be empty.' });
        } else if (first_name.length > 50) {
            return res.status(403).json({ message: 'First name cannot exceed 50 characters!' });
        } else if (!/^[a-zA-ZÀ-ÿ'. -]+$/.test(first_name)) {
            return res.status(403).json({ message: 'First name contains invalid characters.' });
        }

        await Members.updateFirstNameById(id, first_name);
        res.status(200).json({ message: "First name successfully updated!" });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Function to update last name 
exports.userUpdateLastName = async (req, res, next) => {
    try {
        let id = req.params.userId;
        let { last_name } = req.body;

        last_name = validator.escape(last_name.trim());

        if (!last_name) {
            return res.status(400).json({ message: 'Last name cannot be empty.' });
        } else if (last_name.length > 50) {
            return res.status(403).json({ message: 'Last name cannot exceed 50 characters!' });
        } else if (!/^[a-zA-ZÀ-ÿ'. -]+$/.test(last_name)) {
            return res.status(403).json({ message: 'Last name contains invalid characters.' });
        }

        await Members.updateLastNameById(id, last_name);
        res.status(200).json({ message: "Last name successfully updated!" });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Function to change user password
exports.userChangePassword = async (req, res, next) => {
    try {
        const id = req.params.userId;
        let { currentPassword, newPassword, confirmNewPassword } = req.body;

        // Trim all input values
        currentPassword = currentPassword.trim();
        newPassword = newPassword.trim();
        confirmNewPassword = confirmNewPassword.trim();

        // 1. Check current password is correct
        if (!await authenticateUserById(id, currentPassword)) {
            return res.status(403).json({ message: "Incorrect password!" });
        }

        // 2. Prevent reusing the same password
        if (currentPassword === newPassword) {
            return res.status(403).json({ message: "New password must be different from the current password." });
        }

        // 3. Check passwords match
        if (newPassword !== confirmNewPassword) {
            return res.status(403).json({ message: "Passwords do not match!" });
        }

        // 4. Validate password strength
        if (newPassword.length < 8) {
            return res.status(403).json({ message: "Password must be at least 8 characters long!" });
        } else if (!/[A-Z]/.test(newPassword)) {
            return res.status(403).json({ message: "Password must contain at least one uppercase letter." });
        } else if (!/[a-z]/.test(newPassword)) {
            return res.status(403).json({ message: "Password must contain at least one lowercase letter." });
        } else if (!/[0-9]/.test(newPassword)) {
            return res.status(403).json({ message: "Password must contain at least one number." });
        } else if (!/[\W_]/.test(newPassword)) {
            return res.status(403).json({ message: "Password must contain at least one special character." });
        }

        // 5. Hash and store the new password (assumed done inside this function)
        await Members.updatePasswordById(id, newPassword);

        return res.status(200).json({ message: "Password successfully updated!" });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

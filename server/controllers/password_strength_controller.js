const fetch = require('node-fetch');
const crypto = require('crypto');


async function checkPasswordPwned(password) {
    // Hash the password using SHA-1
    const sha1 = crypto.createHash('sha1');
    sha1.update(password);
    const hash = sha1.digest('hex').toUpperCase();

    // Extract the first 5 characters of the hash
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    // Call the Pwned Passwords API with the prefix
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();

    // Split the data into lines and check if any line contains the suffix
    const lines = data.split('\n');
    const found = lines.find(line => line.startsWith(suffix));

    if (found) {
        const parts = found.split(':');
        const count = parseInt(parts[1], 10);
        return true; // Add cracking time calculation if needed
    } else {
        return false; // Add cracking time calculation if needed
    }
}


// Function to estimate the time it takes to crack a password based on its composition
function estimateCrackingTime(password) {
    const guessesPerSecond = 2000000000; // 2 billion guesses per second

    // Define character set sizes
    const lowercase = 26; // Count of lowercase letters (a-z)
    const uppercase = 26; // Count of uppercase letters (A-Z)
    const numbers = 10;   // Count of digits (0-9)
    const specialChars = 32; // Assumption of 32 commonly used special characters

    // Initialize counts of character types found in the password
    let possibleChars = 0;
    let hasLower = false;
    let hasUpper = false;
    let hasNumber = false;
    let hasSpecial = false;

    // Check each character in the password to determine which sets it belongs to
    for (const char of password) {
        if (char >= 'a' && char <= 'z') hasLower = true;
        else if (char >= 'A' && char <= 'Z') hasUpper = true;
        else if (char >= '0' && char <= '9') hasNumber = true;
        else hasSpecial = true;
    }

    // Sum the sizes of all character sets found in the password
    if (hasLower) possibleChars += lowercase;
    if (hasUpper) possibleChars += uppercase;
    if (hasNumber) possibleChars += numbers;
    if (hasSpecial) possibleChars += specialChars;

    // Calculate the total number of possible combinations for the password
    const combinations = Math.pow(possibleChars, password.length);

    // Calculate the time required to crack the password at the specified guessing rate
    let secondsToCrack = combinations / guessesPerSecond;

    // Convert the cracking time from seconds to a more readable format
    if (secondsToCrack < 1) {
        return "Instantly";  // Less than one second to crack
    } else if (secondsToCrack < 60) {
        return `${secondsToCrack.toFixed(2)} Seconds`; // Less than a minute
    } else if (secondsToCrack < 3600) {
        return `${(secondsToCrack / 60).toFixed(2)} Minutes`; // Less than an hour
    } else if (secondsToCrack < 86400) {
        return `${(secondsToCrack / 3600).toFixed(2)} Hours`; // Less than a day
    } else if (secondsToCrack < 31536000) {
        return `${(secondsToCrack / 86400).toFixed(2)} Days`; // Less than a year
    } else {
        // Convert to years and format based on magnitude
        let yearsToCrack = secondsToCrack / 31536000; // Convert to years
        if (yearsToCrack < 1000) {
            return `${Math.floor(yearsToCrack)} Years`; // Less than a thousand years, no decimals
        } else if (yearsToCrack < 1000000) {
            return `${Math.floor(yearsToCrack / 1000)} Thousand Years`; // Thousands of years
        } else if (yearsToCrack < 1000000000) {
            return `${(yearsToCrack / 1000000).toFixed(1)} Million Years`; // Millions of years
        } else if (yearsToCrack < 1000000000000) {
            return `${(yearsToCrack / 1000000000).toFixed(1)} Billion Years`; // Billions of years
        } else {
            return `${(yearsToCrack / 1000000000000).toFixed(1)} Trillion Years`; // Trillions of years
        }
    }
}


exports.assessStrength = async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: "Missing password to assess" });
    }

    try {
        const compromised = await checkPasswordPwned(password);
        const crackingTime = estimateCrackingTime(password);
        let grade = 'pass';
        const tips = [];

        // Convert cracking time to a number for comparison and unit for validation, handling "Instantly" separately
        const timeParts = crackingTime.split(' ');
        const timeUnit = timeParts[1] || 'Instant';

        // Determine if the password is considered compromised or easily crackable
        if (compromised || timeUnit === 'Instant' || timeUnit === "Seconds" || timeUnit === "Minutes" || timeUnit === "Hours" || timeUnit === "Days") {
            grade = 'fail';

            // Generate tips only if the grade is fail
            if (password.length < 12) {
                tips.push("Your password has less than 12 characters. Consider making it longer.");
            }
            if (!/[A-Z]/.test(password)) { // Checking for uppercase letters
                tips.push("Your password has no uppercase letters. Consider using uppercase letters to make it stronger.");
            }
            if (!/[\W_]/.test(password)) { // Checking for special characters and underscore
                tips.push("Your password has no special characters. Consider adding at least one special character to enhance your password strength.");
            }
            if (!/[0-9]/.test(password)) { // Checking for digits
                tips.push("Your password has no digits. Consider adding numbers to increase its complexity.");
            }
        }

        // Structure the response payload
        const responsePayload = {
            grade: grade,
            compromised: compromised,
            cracking_time: crackingTime,
            tips: grade === 'fail' ? tips : [] // Add tips only if grade is 'fail'
        };

        return res.status(200).json({ result: responsePayload });
    } catch (error) {
        console.error("Error assessing password strength:", error);
        return res.status(500).json({ message: "Error assessing password strength" });
    }
};

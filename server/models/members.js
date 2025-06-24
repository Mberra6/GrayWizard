const db = require('../config/db'); // Import database configuration

// Class representing Members model
class Members {
    constructor(username, email, firstName, lastName, password){
        this.username = username;
        this.email = email;
        this.firstName  = firstName;
        this.lastName = lastName;
        this.password = password;
    }

    // Method to save member details to the database
    save = () => {
        let d = new Date();
        let yyyy = d.getFullYear();
        let mm = d.getMonth() + 1;
        let dd = d.getDate();

        let createdAtDate = `${yyyy}-${mm}-${dd}`;

        let sql = `
        INSERT INTO Members(
            username,
            email,
            first_name,
            last_name,
            password,
            is_admin,
            created_at
        )
        VALUES(
            '${this.username}',
            '${this.email}',
            '${this.firstName}',
            '${this.lastName}',
            '${this.password}',
            False,
            '${createdAtDate}'
        );
        `;

        return db.execute(sql); // Execute SQL query to insert member details
    }

    // Static method to find a member by email
    static findByEmail = (email) => {
        let sql = `SELECT * FROM Members WHERE email = '${email}';`; // SQL query to select member by email

        return db.execute(sql); // Execute SQL query to fetch member details
    }

    // Static method to find a member by email (for update profile)
    static findByEmailUpdate = (email, id) => {
        let sql = `SELECT * FROM Members WHERE email = '${email}' AND user_id != '${id}';`; // SQL query to select member by email (excluding current user)

        return db.execute(sql); // Execute SQL query to fetch member details
    }

    // Static method to find a member by username
    static findByUsername = (username) => {
        let sql = `SELECT * FROM Members WHERE username = '${username}';`; // SQL query to select member by username

        return db.execute(sql); // Execute SQL query to fetch member details
    }

    // Static method to find a member by username (for update profile)
    static findByUsernameUpdate = (username, id) => {
        let sql = `SELECT * FROM Members WHERE username = '${username}' AND user_id != '${id}';`; // SQL query to select member by username (excluding current user)

        return db.execute(sql); // Execute SQL query to fetch member details
    }

    // Static method to find a member by ID
    static findById = (id) => {
        let sql = `SELECT * FROM Members WHERE member_id = '${id}';`; // SQL query to select member by ID

        return db.execute(sql); // Execute SQL query to fetch member details
    }

    // Static method to update member details by ID
    static updateById = (id, firstName, lastName, email, username) => {
        let sql = `
        UPDATE Members
        SET first_name = '${firstName}', last_name = '${lastName}', email = '${email}', username = '${username}'
        WHERE member_id = '${id}';
        `; // SQL query to update member details

        return db.execute(sql); // Execute SQL query to update member details
    }

    // Static method to update member password by ID
    static updatePasswordById = (id, newPassword) => {
        let sql = `
        UPDATE Members
        SET password = '${newPassword}'
        WHERE member_id = '${id}';
        `; // SQL query to update member password

        return db.execute(sql); // Execute SQL query to update member password
    }
}

module.exports = Members; // Export Members class

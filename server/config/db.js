// Load and apply the environment variables from the .env file into the process.env object.
require('dotenv').config();

// Import the mysql2 library to interact with MySQL databases.
const mysql = require('mysql2');

// Create a pool of connections to the database, which improves the performance
// of executing database queries by reusing existing connections instead of
// creating a new connection with every request.
const pool = mysql.createPool({
    host: process.env.DB_HOST, // Database host address, typically a URL or IP.
    port: process.env.DB_PORT, // Database port number which MySQL listens to.
    user: process.env.DB_USER, // The username used to authenticate with the database.
    password: process.env.DB_PASSWORD, // The password used to authenticate with the database.
    database: process.env.DB_NAME // The name of the database to access.
});

// Export the pool object wrapped in a promise-based interface. This allows
// for using async/await instead of callbacks when performing SQL operations,
// which helps in writing cleaner, more readable asynchronous code.
module.exports = pool.promise();

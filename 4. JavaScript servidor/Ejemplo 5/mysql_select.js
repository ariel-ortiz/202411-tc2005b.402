// File: mysql_select.js

// Import the mysql and util modules
const mysql = require('mysql');
const util = require('util');

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',                   // The host where the
                                       // database is located
  database: 'web_database',            // Database name
  user: process.env.MYSQL_USER,        // Database username
  password: process.env.MYSQL_PASSWORD // Database password
});

// Convert the connect and query methods from callback-based
// to promise-based
db.connect = util.promisify(db.connect);
db.query = util.promisify(db.query);

// An async function to connect to the database
async function connectToDatabase() {
  try {
    // Try to connect to the database
    await db.connect();
    // If successful, log a success message
    console.log('Connected to database.');
  } catch (err) {
    // If an error occurs, log an error message and
    // re-throw the error
    console.log('Unable to connect to the database.');
    throw err;
  }
}

// An async function to perform a SELECT operation on the
// database
async function do_select() {
    // The SQL query to execute
    const sqlQuery = 'SELECT excerpt FROM quotations WHERE author=?';
    const authorName = 'Alan Turing';
    try {
        // Try to execute the query
        const result = await db.query(sqlQuery, [authorName]);
        // If successful, log a success message
        console.log('Success!');
        // Loop through the result and log each author
        for (let row of result) {
            console.log(row.excerpt);
        }
        // Close the database connection
        db.end();
    } catch (err) {
        // If an error occurs, re-throw the error
        throw err;
    }
}

// Immediately Invoked Function Expression (IIFE) to run the
// async functions. This is used for top-level await which is
// not allowed outside of functions.
(async () => {
  // Connect to the database
  await connectToDatabase();
  // Perform the select operation
  await do_select();
})();

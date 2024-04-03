// Import required modules
const express = require('express');
const mysql = require('mysql');
const util = require('util');

// Set server configuration
const port = 8080;
const ipAddr = '52.20.170.244'; // <--- UPDATE THIS LINE

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  database: 'web_database',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
});

// Promisify methods to allow them to be used with async/await
db.connect = util.promisify(db.connect);
db.query = util.promisify(db.query);

// Create an instance of Express
const app = express();

// For every request, log the current date, HTTP method, and resource
app.use((req, res, next) => {
  console.log(new Date(), req.method, req.url);
  next();
});

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

// Parse JSON request bodies
app.use(express.json());

// Get all quotations
app.get('/quotations', async (req, res) => {
  try {
    const sqlSelect = 'SELECT id, author, excerpt FROM quotations';
    const rows = await db.query(sqlSelect);
    let result = [];
    for (let row of rows) {
      result.push({
        id: row.id,
        author: row.author,
        prelude: row.excerpt?.split(' ').slice(0, 3).join(' ') + '...',
        url: `http://${ ipAddr }:${ port }/quotations/${ row.id }`
      });
    }
    res.json(result);
    return;
  } catch (err) {
      res.status(500).json(err);
  }
});

// Get a specific quotation by ID
app.get('/quotations/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const sqlSelect = 'SELECT id, author, excerpt FROM quotations WHERE id=?';
    const rows = await db.query(sqlSelect, [id]);
    let row = rows[0];
    if (row) {
      res.json({
        id: row.id,
        author: row.author,
        excerpt: row.excerpt
      });
      return;
    } else {
      res.type('text')
        .status(404)
        .send(`Resource with ID = ${ id } not found.\n`);
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new quotation
app.post('/quotations', async (req, res) => {
  try {
    const { author, excerpt } = req.body;
    const sqlInsert = 'INSERT INTO quotations (author, excerpt) VALUES (?, ?)';
    const result = await db.query(sqlInsert, [author, excerpt]);
    res.type('text')
      .status(201)
      .send(`Resource created with ID = ${ result.insertId }.\n`);
    return;
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a quotation by ID
app.put('/quotations/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { author, excerpt } = req.body;
    const sqlUpdate = 'UPDATE quotations SET author=?, excerpt=? WHERE id=?';
    const result = await db.query(sqlUpdate, [author, excerpt, id]);
    if (result.affectedRows === 1) {
      res.type('text').send(
        `Resource with ID = ${ id } updated.\n`);
      return;
    } else {
      res.type('text')
        .status(400)
        .send(`Unable to update resource with ID = ${ id }.\n`);
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete all quotations
app.delete('/quotations', async (req, res) => {
  try {
    const sqlDelete = 'DELETE FROM quotations';
    const result = await db.query(sqlDelete);
    if (result.affectedRows > 0) {
      res.type('text')
        .send(`${ result.affectedRows } resource(s) deleted.\n`);
      return;
    } else {
      res.type('text')
        .status(404)
        .send(`No resources found.\n`);
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a specific quotation by ID
app.delete('/quotations/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const sqlDelete = 'DELETE FROM quotations WHERE id=?';
    const result = await db.query(sqlDelete, [id]);
    if (result.affectedRows === 1) {
      res.type('text')
        .send(`Resource with ID = ${ id } deleted.\n`);
      return;
    } else {
      res.type('text')
        .status(404)
        .send(`Resource with ID = ${ id } not found.\n`);
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// This code should go after all handlers because it is the final
// middleware in the chain. If no other middleware handles the
// request, this middleware will be responsible for returning a
// 404 - Not Found response.
app.use((req, res) => {
  res.type('text')
    .status(404)
    .send('404 - Not Found');
  return;
});

// Start the server by binding and listening for connections
// on the specified port
app.listen(port, () => console.log(
`Express started on http://${ ipAddr }:${ port }
Press Ctrl-C to terminate.`));

// Connect to the database
(async () => {
  try {
    await db.connect();
    console.log('Connected to the database.');
  } catch (err) {
    console.error('Unable to connect to the database.');
    throw err;
  }
})();

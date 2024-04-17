/******************************************************************************
 * Distributed Tic-tac-toe Game
 * Web API server.
 * Copyright (C) 2024 by Ariel Ortiz
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

// Import required modules
const express = require('express');
const mysql = require('mysql');
const util = require('util');

// Set this const to true if you need the contents of the database tables
// to be deleted when the starting the program
const resetDatabaseOnStart = true;

// Set server configuration
const port = process.env.NODE_PORT;
const ipAddr = process.env.NODE_IPADDR;

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  database: 'tictactoe',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
});

// Promisify methods to allow them to be used with async/await
db.connect = util.promisify(db.connect);
db.query = util.promisify(db.query);
db.beginTransaction = util.promisify(db.beginTransaction);
db.commit = util.promisify(db.commit);
db.rollback = util.promisify(db.rollback);

// Used to determine the adversary's symbol
const adversary = { 'x': 'o', 'o': 'x' };

// Returns a two element array with the game and player database row objects
// given a playerId. If any of these is not found, return [null, null].
async function getGameAndPlayer(playerId) {

  async function selectPlayer() {
    const sqlSelectPlayer =
      'SELECT gameName, symbol FROM players WHERE id=?';
    const rows = await db.query(sqlSelectPlayer, [playerId]);
    if (rows.length !== 1) {
      return null;
    }
    return rows[0];
  }

  async function selectGame() {
    const { gameName } = player;
    const sqlSelectGame =
      'SELECT state, turn, board FROM games WHERE name=?';
    const rows = await db.query(sqlSelectGame, [gameName]);
    if (rows.length !== 1) {
      return null;
    }
    return rows[0];
  }

  const player = await selectPlayer();
  if (player === null) {
    return [null, null];
  }
  const game = await selectGame();

  return [game, player];
}

// Delete all rows from the players and games tables
async function resetDatabaseTables() {
  try {
    const sqlDeletePlayers = 'DELETE FROM players';
    const sqlDeleteGames = 'DELETE FROM games';

    await db.beginTransaction();
    await db.query(sqlDeletePlayers);
    await db.query(sqlDeleteGames);
    await db.commit();

    console.log('The database tables have been reset.');

  } catch (err) {
    await db.rollback();
    console.log(err);
  }
}

// Return a string with the name of the cell sequence in which s wins
// on board b, or null if there is no winning sequence
function gameWon(s, b) {
  if (s === b[0] && s === b[1] && s === b[2]) {
    return 'row-1';
  }
  if (s === b[3] && s === b[4] && s === b[5]) {
    return 'row-2';
  }
  if (s === b[6] && s === b[7] && s === b[8]) {
    return 'row-3';
  }
  if (s === b[0] && s === b[3] && s === b[6]) {
    return 'col-1';
  }
  if (s === b[1] && s === b[4] && s === b[7]) {
    return 'col-2';
  }
  if (s === b[2] && s === b[5] && s === b[8]) {
    return 'col-3';
  }
  if (s === b[0] && s === b[4] && s === b[8]) {
    return 'diag-1';
  }
  if (s === b[6] && s === b[4] && s === b[2]) {
    return 'diag-2';
  }
  return null;
}

// Return true if the board is full, or false otherwise
function isFull(board) {
  for (const c of board) {
    if (c === '_') {
      return false;
    }
  }
  return true;
}

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

// Create a new game and its first player
app.post('/tictactoe/create', async (req, res) => {

  async function insertGame() {
    const state = 'UNSTARTED';
    const board = '_________';
    const sqlInsertGame = 'INSERT INTO games VALUES (?, ?, ?, ?)';
    await db.query(sqlInsertGame, [gameName, state, symbol, board]);
  }

  async function insertPlayer() {
    const sqlInsertPlayer =
      'INSERT INTO players (gameName, symbol) values (?, ?)';
    return (await db.query(sqlInsertPlayer, [gameName, symbol])).insertId;
  }

  const result = {};
  const { gameName } = req.body;
  const symbol = 'x';

  try {
    await db.beginTransaction();
    await insertGame();
    const id = await insertPlayer();
    await db.commit();

    result.state = 'SUCCESS';
    result.playerId = id;
    result.symbol = symbol;
    result.message = `New game created: ${ gameName }`;
    res.json(result);
    return;

  } catch (err) {
    await db.rollback();

    if (err.code === 'ER_DUP_ENTRY') {
      result.state = 'FAIL';
      result.message = `Can't create duplicated game: ${ gameName }`;
      res.json(result);
      return;
    }

    res.status(500).json(err);
  }
});

// Get all availabe games
app.get('/tictactoe/games', async (req, res) => {

  async function selectGameRows() {
    const sqlSelect = 'SELECT name, state, turn, board FROM games '
      + 'ORDER BY name';
    return await db.query(sqlSelect);
  }

  try {
    const rows = await selectGameRows();
    const result = [];
    for (const row of rows) {
      result.push({
        name: row.name,
        state: row.state,
        turn: row.turn,
        board: row.board
      });
    }

    res.json({ state: "SUCCESS", games: result });
    return;

  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new player and make it join an available game
app.put('/tictactoe/join', async (req, res) => {

  async function selectGameRow() {
    const sqlSelect = 'SELECT state FROM games WHERE name=?';
    return await db.query(sqlSelect, [gameName]);
  }

  async function insertPlayer() {
    const sqlInsertPlayer =
      'INSERT INTO players (gameName, symbol) values (?, ?)';
    return (await db.query(sqlInsertPlayer, [gameName, symbol])).insertId;
  }

  async function updateGame(gameName) {
    const state = 'STARTED';
    const sqlUpdate = 'UPDATE games SET state=? WHERE name=?';
    await db.query(sqlUpdate, [state, gameName]);
  }

  const result = {};
  const { gameName } = req.body;
  const symbol = 'o';

  try {
    await db.beginTransaction();

    const gameRow = await selectGameRow();

    if (gameRow.length !== 1) {
      db.rollback();
      result.state = 'FAIL';
      result.message = `Game not found: ${ gameName }.`;
      res.json(result);
      return;
    }

    const state = gameRow[0].state;

    if (state !== 'UNSTARTED') {
      db.rollback();
      result.state = 'FAIL';
      result.message = `Game has already ${ state }: ${ gameName }.`;
      res.json(result);
      return;
    }

    const id = await insertPlayer();
    await updateGame(gameName);

    db.commit();

    result.state = 'SUCCESS';
    result.playerId = id;
    result.symbol = symbol;
    res.json(result);
    return;

  } catch (err) {
    db.rollback();
    res.status(500).json(err);
  }
});

// Get the current state of a game for a given player
app.get('/tictactoe/state/:id', async (req, res) => {

  const result = {};
  const playerId = req.params.id;

  try {
    const [game, player] = await getGameAndPlayer(playerId);

    if (game === null || player === null) {
      result.state = 'FAIL';
      result.message = `Game or player with id=${ playerId } not found`;
      res.json(result);
      return;
    }

    const { state, turn, board } = game;
    const { gameName, symbol } = player;

    result.board = board;

    if (state === 'UNSTARTED') {
      result.state = 'WAIT';
      result.message = `Game has not started: ${ gameName }`;
      res.json(result);
      return;
    }

    let winningSeq;

    if ((winningSeq=gameWon(symbol, board))) {
      result.state = 'WIN';
      result.winningSeq = winningSeq;
      res.json(result);
      return;
    }

    if ((winningSeq=gameWon(adversary[symbol], board))) {
      result.state = 'LOSE';
      result.winningSeq = winningSeq;
      res.json(result);
      return;
    }

    if (isFull(board)) {
      result.state = 'TIE';
      res.json(result);
      return;
    }

    if (turn === symbol) {
      result.state = 'TURN';
      res.json(result);
      return;
    }

    result.state = 'WAIT';
    result.message = "Adversary's turn";
    res.json(result);
    return;

  } catch (err) {
    res.status(500).json(err);
  }
});


// Place the player's symbol on the board
app.put('/tictactoe/place', async (req, res) => {

  function isValidGo(board, position) {
    if (0 <= position && position <= 8) {
      return board[position] === '_';
    }
    return false;
  }

  function isGameFinished(board, symbol) {
    return gameWon(symbol, board)
        || gameWon(adversary[symbol], board)
        || isFull(board);
  }

  async function updateBoard(gameName, board, symbol) {
    const turn = adversary[symbol];
    const state = isGameFinished(board, symbol)
      ? 'FINISHED'
      : 'STARTED';
    const sqlUpdate = 'UPDATE games SET state=?, turn=?, board=? WHERE name=?';
    await db.query(sqlUpdate, [state, turn, board, gameName]);
  }

  const result = {};

  try {
    const { playerId, position } = req.body;
    const [game, player] = await getGameAndPlayer(playerId);

    if (game === null || player === null) {
      result.state = 'FAIL';
      result.message = `Game or player with id=${ playerId } not found`;
      res.json(result);
      return;
    }

    const { state, turn, board } = game;
    const { gameName, symbol } = player;

    if (state !== 'STARTED') {
      result.state = 'FAIL';
      result.message = `Game is ${ state }: ${ gameName }`;
      res.json(result);
      return;
    }

    if (turn !== symbol) {
      result.state = 'FAIL';
      result.message = `Current turn not for '${ symbol }'`;
      res.json(result);
      return;
    }

    if (typeof position !== 'number') {
      result.state = 'FAIL';
      result.message = `Position ${ position } is not a number`;
      res.json(result);
      return;
    }

    if (!isValidGo(board, position)) {
      result.state = 'FAIL';
      result.message = `Position ${ position } not available on ${ board } `;
      res.json(result);
      return;
    }

    const newBoard =
      board.substring(0, position)
      + symbol
      + board.substring(position + 1);
    await updateBoard(gameName, newBoard, symbol);

    result.state = 'SUCCESS';
    result.board = newBoard;
    res.json(result);
    return;

  } catch (err) {
    res.status(500).json(err);
  }
});

// This code should go after all handlers because it is the final
// middleware in the chain. If no other middleware handles the
// request, this middleware will be responsible for returning a
// 404 - Not Found response.
app.use((req, res) => {
  const result = {
    state: 'FAIL',
    message: `Resource not found: ${ req.method} ${ req.url }`
  };
  res.status(404).json(result);
  return;
});

// Start the server by binding and listening for connections on the specified
// port, then connect to the database
async function main() {
  try {
    app.listen = util.promisify(app.listen);
    await app.listen(port);
    console.log('Tic-tac-toe Web Application.');
    console.log('\u{00A9} 2024 by Ariel Ortiz');
    console.log(`Server started on http://${ ipAddr }:${ port }`);
    console.log('Press Ctrl-C to terminate.');
    await db.connect();
    console.log('Connected to the database.');
    if (resetDatabaseOnStart) {
      await resetDatabaseTables();
    }
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
}

main();

/******************************************************************************
 * Distributed Tic-tac-toe Game
 * Web browser client.
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

// Applicationwide constants
const waitTime = 1000;
const symbolColorClass = {'x': 'w3-text-teal', 'o': 'w3-text-pink'};

// DOM Components
const mainMenuDiv = document.getElementById('main-menu-div');
const mainCreateBtn = document.getElementById('main-create-btn');
const mainJoinBtn = document.getElementById('main-join-btn');
const createGameDiv = document.getElementById('create-game-div');
const gameNameInput = document.getElementById('game-name-input');
const createBtn = document.getElementById('create-btn');
const errorDialog = document.getElementById('error-dialog');
const errorMessageText = document.getElementById('error-message-text');
const closeErrorDialogBtn = document.getElementById('close-error-dialog-btn');
const joinGameDiv = document.getElementById('join-game-div');
const gameList = document.getElementById('game-list');
const waitJoinDiv = document.getElementById('wait-join-div');
const waitJoinMessage1 = document.getElementById('wait-join-message-1');
const waitJoinMessage2 = document.getElementById('wait-join-message-2');
const gameBoardDiv = document.getElementById('game-board-div');
const gameBoardSymbol = document.getElementById('game-board-symbol');
const gameBoardMessage = document.getElementById('game-board-message');
const boardTable = document.getElementById('board-table');
const mainMenuButton = document.getElementById('main-menu-button');

// Applicationwide variables
let playerId;
let symbol;

// Event listeners
mainCreateBtn.addEventListener('click', createNewGame);

mainJoinBtn.addEventListener('click', joinGame);

createBtn.addEventListener('click', callCreate);

gameNameInput.addEventListener('keypress', async event => {
  if (event.key === 'Enter') {
    await callCreate();
  }
});

closeErrorDialogBtn.addEventListener('click', () => {
  errorDialog.style.display = 'none';
});

function errorMessage(message) {
  errorMessageText.innerText = JSON.stringify(message);
  errorDialog.style.display = 'block';
}

async function httpRequest(method, url, payload) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (payload) {
    options.body = JSON.stringify(payload);
  }
  const response = await fetch(url, options); /* global fetch */
  if (!response.ok) {
    throw new Error(`HTTP error. Status: ${response.status}`);
  }
  return await response.json();
}

function makeVisible(element) {
  element.classList.remove('invisible');
}

function makeInvisible(element) {
  element.classList.add('invisible');
}

function createNewGame() {
  makeInvisible(mainMenuDiv);
  makeVisible(createGameDiv);
}

function secondsElapsed(seconds) {
  return `${ seconds } second${ seconds === 1 ? '': 's' } elapsed.`;
}

async function callCreate() {

  function validateNonEmptyGameName() {
    const value = gameNameInput.value.trim();
    if (value === '') {
      errorMessage('You must provide a non-empty game name.');
      return null;
    } else {
      return value;
    }
  }

  try {
    const gameName = validateNonEmptyGameName();
    if (!gameName) {
      return;
    }
    const result = await httpRequest('POST', '/tictactoe/create', { gameName });
    if (result.state !== 'SUCCESS') {
      errorMessage(result.message);
      return;
    }
    playerId = result.playerId;
    symbol = result.symbol;
    waitJoinMessage1.innerHTML = result.message;
    startJoinWaiting();
    makeInvisible(createGameDiv);
    makeVisible(waitJoinDiv);
  } catch (err) {
    errorMessage(err);
  }
}

function startJoinWaiting() {

  async function waitLoop() {
    try {
      seconds++;
      waitJoinMessage2.innerText = secondsElapsed(seconds);
      let result = await httpRequest('GET', `/tictactoe/state/${ playerId }`);
      if (result.state === 'WAIT') {
        setTimeout(waitLoop, waitTime);
      } else {
        gameBoardSymbol.innerText = symbol;
        gameBoardSymbol.classList.add(symbolColorClass[symbol]);
        makeInvisible(waitJoinDiv);
        makeVisible(gameBoardDiv);
        play();
      }
    } catch (err) {
      errorMessage(err);
    }
  }

  let seconds = 0;
  setTimeout(waitLoop, waitTime);
}

async function joinGame() {

  function callJoin(gameName) {
    return async () => {
      try {
        const result = await httpRequest('PUT', '/tictactoe/join', { gameName });
        if (result.state !== 'SUCCESS') {
          errorMessage(result.message);
          return;
        }
        playerId = result.playerId;
        symbol = result.symbol;
        gameBoardSymbol.innerText = symbol;
        gameBoardSymbol.classList.add(symbolColorClass[symbol]);
        makeInvisible(joinGameDiv);
        makeVisible(gameBoardDiv);
        play();
      } catch (err) {
        errorMessage(err);
      }
    };
  }

  function listAllGamesToJoin() {
    for (const game of result.games) {
      if (game.state === 'UNSTARTED') {
        const p  = document.createElement('p');
        const button = document.createElement('button');
        button.classList.add('w3-btn', 'w3-block', 'w3-blue', 'w3-large');
        button.innerText = game.name;
        button.addEventListener('click', callJoin(game.name));
        p.appendChild(button);
        gameList.appendChild(p);
        foundOne = true;
      }
    }
  }

  function informNoGamesAvailable() {
    const p  = document.createElement('p');
    p.classList.add('w3-text-red');
    p.classList.add('w3-xlarge');
    p.innerText = 'Sorry, there are no games currently available.';
    gameList.appendChild(p);
  }

  let result;
  let foundOne = false;
  try {
    result = await httpRequest('GET', '/tictactoe/games');
    gameList.textContent = '';
    listAllGamesToJoin();
    if (!foundOne) {
      informNoGamesAvailable();
    }
    makeInvisible(mainMenuDiv);
    makeVisible(joinGameDiv);

  } catch (err) {
    errorMessage(err);
  }
}

function play() {

  function setButtonEventListeners() {
    for (let i = 0; i < 9; i++) {
      boardCell[i] = document.getElementById(`b${ i }`);
      boardCell[i].addEventListener('click',
        makeCallPlaceFunction(boardCell[i], i));
      boardCell[i].choosable = false;
    }
  }

  function makeCallPlaceFunction(button, position) {
    return async () => {
      if (boardCell[position].choosable) {
        boardCell[position].choosable = false;
        try {
          const result = await httpRequest('PUT', '/tictactoe/place',
            { playerId, position });
          if (result.state !== 'SUCCESS') {
            errorMessage(result.message);
            return;
          }
          button.innerText = symbol;
          button.classList.add(symbolColorClass[symbol]);
          seconds = 0;
          updateBoard(result.board);
          boardTable.classList.add('w3-disabled');
          setTimeout(playLoop, waitTime);
        } catch (err) {
          errorMessage(err);
        }
      }
    };
  }

  function updateBoard(board) {
    for (let i = 0; i < 9; i++) {
      if (board[i] === '_') {
        boardCell[i].choosable = true;
        boardCell[i].classList.add('choosable');
        boardCell[i].innerText = ' ';
      } else {
        boardCell[i].choosable = false;
        boardCell[i].classList.remove('choosable');
        boardCell[i].classList.add(symbolColorClass[board[i]]);
        boardCell[i].innerText = board[i];
      }
    }
  }

  function endGame(message, board, winningSeq) {

    function removeChoosabilty(){
      for (let i = 0; i < 9; i++) {
        boardCell[i].choosable = false;
        boardCell[i].classList.remove('choosable');
      }
    }

    function highlightWinningSequence() {
      if (winningSeq) {
        const seqs = {'row-1': [0, 1, 2], 'row-2': [3, 4, 5],
                      'row-3': [6, 7, 8], 'col-1': [0, 3, 6],
                      'col-2': [1, 4, 7], 'col-3': [2, 5, 8],
                      'diag-1': [0, 4, 8], 'diag-2': [6, 4, 2] };
        for (const i of seqs[winningSeq]) {
          boardCell[i].classList.add('w3-light-blue', 'w3-text-black');
        }
      }
    }

    gameBoardMessage.innerText = message;
    boardTable.classList.remove('w3-disabled');
    updateBoard(board);
    removeChoosabilty();
    highlightWinningSequence();
    makeVisible(mainMenuButton);
  }

  async function playLoop() {
    try {
      seconds++;
      const result = await httpRequest('GET', `/tictactoe/state/${ playerId }`);
      if (result.state === 'WAIT') {
        gameBoardMessage.innerText = `It's not your turn. `
          + secondsElapsed(seconds);
        boardTable.classList.add('w3-disabled');
        updateBoard(result.board);
        setTimeout(playLoop, waitTime);
        return;
      }
      if (result.state === 'TURN') {
        gameBoardMessage.innerText = `It's your turn.`;
        boardTable.classList.remove('w3-disabled');
        updateBoard(result.board);
        return;
      }
      if (result.state === 'WIN') {
        endGame('Game over. You won!', result.board, result.winningSeq);
        return;
      }
      if (result.state === 'LOSE') {
        endGame('Game over. You lost!', result.board, result.winningSeq);
        return;
      }
      if (result.state === 'TIE') {
        endGame(`Game over. It's a tie.`, result.board);
        return;
      }
    } catch (err) {
      errorMessage(err);
    }
  }

  let seconds = 0;
  const boardCell = new Array(9);
  setButtonEventListeners();
  setTimeout(playLoop, waitTime);
}

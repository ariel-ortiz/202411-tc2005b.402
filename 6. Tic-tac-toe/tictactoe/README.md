# Tic-tac-toe Web Application

By Ariel Ortiz. April 16, 2024.

## Create Database

The following commands assume that the MySQL server is installed and running.

Login to the `mysql` monitor. At the terminal, type:

    mysql -u root -p

Run the `tictactoe.sql` script. Type at the monitor prompt:

    source tictactoe.sql

Press Ctrl-D to exit the monitor program.

## Set Environment Variables

Make sure your `.bashrc` file sets and exports the following four environment variables (replace the values where appropriate):

```bash
export NODE_PORT="8080"               # Application's port number
export NODE_IPADDR="127.0.0.1"        # EC2 instance's public IP Address
export MYSQL_USER="root"              # MySQL user's name
export MYSQL_PASSWORD="some_password" # MySQL user's password
```

## Install Dependencies

The web application requires the following Node modules: `express` and `mysql`. At the terminal, type:

    npm install express mysql

A `node_modules` directory should be created in the current directory containing all the required modules and its dependencies.

## Run Web Application

To run the web application, type at the terminal:

```bash
nodemon app.js
```

Open the corresponding link in your web browser address bar:

    http://public-ip-address:8080/

Press Ctrl-C at the terminal to terminate the server.

## Endpoint Documentation

**NOTE:** All the endpoints described below may respond with a status code 500 indicating that some kind of runtime error was produced by the server-side code.

### `POST /tictactoe/create`

Create a new game and its first player.

- **REQUEST:**

    The request body should be a JSON object with the following key:

    - `"gameName"`: the name of the new game to create

    Example:

    ```json
    {
        "gameName": "Master Game"
    }
    ```

- **RESPONSE:** Status code 200

    - If the creation of the game was successful, the body of the response is a JSON object with the following keys:

        - `"state"`: `"SUCCESS"`
        - `"playerId"`: the unique id for the first player of the game just created
        - `"symbol"`: `"x"`
        - `"message"`: a message indicating that a new game has been created

        Example:

        ```json
        {
            "state": "SUCCESS",
            "playerId": 1,
            "symbol": "x",
            "message": "New game created: Master Game"
        }
        ```
    - If the given game name already exists, the body of the response is a JSON object with the following keys:

        - `"state"`: `"FAIL"`
        - `"message"`: A message indicating that the name of the game is duplicated

        Example:

        ```json
        {
            "state": "FAIL",
            "message": "Can't create duplicated game: Master Game"
        }
        ```

### `GET /tictactoe/games`

Get a list with the information related to all the games currently stored in the database.

- **REQUEST:**

    No request body should be provided.

- **RESPONSE:** Status code 200

    The response body is a JSON object with the following keys:

    - `"state"`: `"SUCCESS"`
    - `"games"`: an array of game objects

  Each game object has the following keys:

    - `"name"`: the name of the game
    - `"state"`: the current state of the game, one of:
        - `"UNSTARTED"`
        - `"STARTED"`
        - `"FINISHED"`
    - `"turn"`: the symbol (`"x"` or `"o"`) of the player whose turn it is right now
    - `"board"`: a string of length 9 that represents the tic-tac-toe board mapped to the following indexes/positions:
        ```
         0 | 1 | 2
        ---+---+---
         3 | 4 | 5
        ---+---+---
         6 | 7 | 8
        ```
        Empty cells are represented with an underscore character (`_`). An occupied cell has one of the player’s symbol (`"x"` or `"o"`).

    Example:

    ```json
    {
        "state": "SUCCESS",
        "games": [
            {
                "name": "Master Game",
                "state": "STARTED",
                "turn": "o",
                "board": "o_x_x____"
            },
            {
                "name": "Something else",
                "state": "UNSTARTED",
                "turn": "x",
                "board": "_________"
            },
            {
                "name": "Cool Game",
                "state": "FINISHED",
                "turn": "x",
                "board": "o_xox_o_x"
            }
        ]
    }
    ```

### `PUT /tictactoe/join`

Create a new player and join it to an unstarted game.

- **REQUEST:**

    The request body should be a JSON object with the following key:

    - `"gameName"`: the name of the game to join

    Example:

    ```json
    {
        "gameName": "Master Game"
    }
    ```

- **RESPONSE:** Status code 200

    - If joining the specified game is possible, the body of the response is a JSON object with the following keys:

        - `"state"`: `"SUCCESS"`
        - `"playerId"`: the unique id for the second player of the game that has been joined
        - `"symbol"`: `"o"`

        Example:

        ```json
        {
            "state": "SUCCESS",
            "playerId": 2,
            "symbol": "o"
        }
        ```
    - If joining the specified game was not possible, the body of the response is a JSON object with the following keys:

        - `"state"`: `"FAIL"`
        - `"message"`: A message indicating the reason why joining the game was not possible, which can be one of the following:
            - The specified game doesn’t exist
            - The game is not in the unstarted state

        Example:

        ```json
        {
            "state": "FAIL",
            "message": "Game not found: Some Game"
        }
        ```

### `GET /tictactoe/state/{ID}`

Get the current state of a game for the player with the given ID.

- **REQUEST:**

    No request body should be provided.

- **RESPONSE:** Status code 200

    The response is a JSON object with the following keys:

    - `"state"`: the current state for the given player id. It can be any of the following:

        - `"WAIT"`: the game has not started or it’s the other player’s turn

        - `"TURN"`: it’s the player’s turn

        - `"WIN"`: the game has finished and the player has won the game

        - `"LOSE"`: the game has finished and the player has lost the game

        - `"TIE"`: the game has finished and the game is a tie

        - `"FAIL"`: player with the given id not found

    - `"winningSeq"`: if the player won (or lost) the game, it specifies the corresponding winning (or losing) sequence.

        For the board:

        ```
         0 | 1 | 2
        ---+---+---
         3 | 4 | 5
        ---+---+---
         6 | 7 | 8
        ```

        the possible values are:

        - `"row-1"`: positions 0, 1, and 2
        - `"row-2"`: positions 3, 4, and 5
        - `"row-3"`: positions 6, 7, and 8
        - `"col-1"`: positions 0, 3, and 6
        - `"col-2"`: positions 1, 4, and 7
        - `"col-3"`: positions 2, 5, and 8
        - `"diag-1"`: positions 0, 4, and 8
        - `"diag-2"`: positions 6, 4, and 2

    - `"message"`: if appropriate, an optional message giving more information about the current state

    Example:

    ```json
    {
        "state": "WIN",
        "board": "x_oxo_xox",
        "winningSeq": "col-1"
    }
    ```

### `PUT /tictactoe/place`

Place the player’s symbol on the board.

- **REQUEST:**

    The request body should be a JSON object with the following keys:

    - `"playerId"`: the unique id of the player doing the placing
    - `"position"`: the position where to place the player’s symbol, one of the following values:

        ```
         0 | 1 | 2
        ---+---+---
         3 | 4 | 5
        ---+---+---
         6 | 7 | 8
        ```

    Example:

    ```json
    {
        "playerId": 1,
        "position": 4
    }
    ```

- **RESPONSE:** Status code 200

    - If the move was valid, the body of the response is a JSON object with the following keys:

        - `"state"`: `"SUCCESS"`
        - `"board"`: a string of length 9 that represents the resulting tic-tac-toe board mapped to the following indexes/positions:
        ```
         0 | 1 | 2
        ---+---+---
         3 | 4 | 5
        ---+---+---
         6 | 7 | 8
        ```
        Empty cells are represented with an underscore character (`_`). An occupied cell has one of the player’s symbol (`"x"` or `"o"`).

        Example:

        ```json
        {
            "state": "SUCCESS",
            "board": "____x____"
        }
        ```
    - If the move was not valid, the body of the response is a JSON object with the following keys:

        - `"state"`: `"FAIL"`
        - `"message"`: A message indicating the reason why the move was not valid, which can be one of the following:
            - Player with the given id not found
            - The game is not in the started state
            - It’s not the player’s turn
            - The provided position is not a number
            - The provided position doesn’t exist or is occupied

        Example:

        ```json
        {
            "state": "FAIL",
            "message": "Current turn not for 'x'"
        }
        ```

--
-- Database and tables creation script.
--
-- Copyright © 2024 by Ariel Ortiz.
--
-- Free use of this source code is granted under the terms of the
-- GPL version 3 License.
--

DROP DATABASE IF EXISTS tictactoe;

CREATE DATABASE tictactoe;

use tictactoe;

CREATE TABLE games (
  name       VARCHAR(255) NOT NULL,
  state      ENUM('UNSTARTED', 'STARTED', 'FINISHED') NOT NULL,
  turn       CHAR NOT NULL,
  board      CHAR(9) NOT NULL,
  PRIMARY KEY (name));

CREATE TABLE players (
  id         INT AUTO_INCREMENT,
  gameName   VARCHAR(255) NOT NULL,
  symbol     CHAR NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (gameName) REFERENCES games(name));

--
-- Database and table creation script.
--
-- Copyright © 2016-2024 by Ariel Ortiz.
--
-- Free use of this source code is granted under the terms of the
-- GPL version 3 License.
--

CREATE DATABASE IF NOT EXISTS web_database;

use web_database;

DROP TABLE IF EXISTS quotations;

CREATE TABLE quotations (
  id       INT NOT NULL AUTO_INCREMENT,
  author   TEXT,
  excerpt  TEXT,
  PRIMARY KEY (id));

INSERT INTO quotations (author, excerpt) VALUES
  ('Harold Abelson', 'Programs must be written for people to read, and only incidentally for machines to execute.'),
  ('Alan Kay', "Technology is anything that wasn't around when you were born."),
  ('Donald Knuth', 'Everyday life is like programming, I guess. If you love something you can put beauty into it.'),
  ('Homer Simpson', 'The Internet? Is that thing still around?'),
  ('Anonymous', "If you understand what you're doing, you're not learning anything."),
  ('Anonymous', 'Programs for sale: fast, reliable, cheap - choose two.'),
  ('Charles Babbage', 'On two occasions, I have been asked [by members of Parliament], "Pray, Mr. Babbage, if you put into the machine wrong figures, will the right answers come out?" I am not able to rightly apprehend the kind of confusion of ideas that could provoke such a question.'),
  ('Radia Pearlman', "The world would be a better place if more engineers, like me, hated technology. The stuff I design, if I'm successful, nobody will ever notice. Things will just work, and be self-managing."),
  ('Isaac Asimov', 'I do not fear computers. I fear lack of them.'),
  ('George Boole', 'That language is an instrument of human reason, and not merely a medium for the expression of thought, is a truth generally admitted.'),
  ('Edsger Dijkstra', 'The question of whether Machines Can Think is about as relevant as the question of whether Submarines Can Swim.'),
  ('Howard Aiken', "Don't worry about people stealing your ideas. If your ideas are any good, you'll have to ram them down people's throats."),
  ('Edsger Dijkstra', 'The use of COBOL cripples the mind; its teaching should, therefore, be regarded as a criminal offense.'),
  ('Alan Turing', 'Sometimes it is the people no one can imagine anything of who do the things no one can imagine.'),
  ('Edsger Dijkstra', "Besides a mathematical inclination, an exceptionally good mastery of one's native tongue is the most vital asset of a competent programmer."),
  ('Anonymous', 'Weeks of programming can save you hours of planning.'),
  ('Thomas Watson', 'If you want to increase your success rate, double your failure rate.'),
  ('Brian Kernigan', 'Controlling complexity is the essence of computer programming.'),
  ('Anonymous', 'The Cray-3 is so fast it can execute an infinite loop in under 2 seconds!'),
  ('Chinese Proverb', 'He who asks is a fool for five minutes; he who does not ask remains a fool forever.'),
  ('Alan Turing', 'A computer would deserve to be called intelligent if it could deceive a human into believing that it was human.'),
  ('Edsger Dijkstra', 'It is not the task of the University to offer what society asks for, but to give what society needs.'),
  ('Thomas Watson', 'The great accomplishments of man have resulted from the transmission of ideas and enthusiasm.'),
  ('Anonymous', "Real programmers don't comment their code. If it was hard to write, it should be hard to understand."),
  ('Kent Beck', 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.'),
  ('Fred Brooks', 'The fundamental problem with program maintenance is that fixing a defect has a substantial chance of introducing another.'),
  ('Alan Kay', 'The best way to predict the future is to invent it.'),
  ('Grace Hopper', 'No computer is ever going to ask a new, reasonable question. It takes trained people to do that.'),
  ('Alan Kay', 'People who are really serious about software should make their own hardware.'),
  ('Linus Torvalds', 'Intelligence is the ability to avoid doing work, yet getting the work done.'),
  ('Alan Kay', "If you don't fail at least 90 percent of the time, you're not aiming high enough."),
  ('Kent Beck', "I'm not a great programmer; I'm just a good programmer with great habits."),
  ('Fred Brooks', 'Adding manpower to a late software project makes it later.'),
  ('Anonymous', 'Experience is a poor teacher: it gives its tests before it teaches its lessons.'),
  ('Donald Knuth', 'Let us change our traditional attitude to the construction of programs. Instead of imagining that our main task is to instruct a computer what to do, let us concentrate rather on explaining to human beings what we want a computer to do.'),
  ('Alan Turing', 'Machines take me by surprise with great frequency.'),
  ('Anonymous', 'All programmers are playwrights and all computers are lousy actors.'),
  ('Anonymous', 'Think twice, code once.'),
  ('Grace Hopper', 'I had a running compiler and nobody would touch it. They carefully told me, computers could only do arithmetic; they could not do programs.'),
  ('Linus Torvalds', "Software is like sex: it's better when it's free."),
  ('Anonymous', 'Any programming problem can be solved by adding a level of indirection.'),
  ('Douglas Adams', 'A common mistake that people make when trying to design something completely foolproof is to underestimate the ingenuity of complete fools.'),
  ('Kent Beck', "I always knew that one day Smalltalk would replace Java. I just didn't know it would be called Ruby."),
  ('Edsger Dijkstra', 'When we had no computers, we had no programming problem either. When we had a few computers, we had a mild programming problem. Confronted with machines a million times as powerful, we are faced with a gigantic programming problem.'),
  ('Donald Knuth', 'Science is what we understand well enough to explain to a computer. Art is everything else we do.'),
  ('Thomas Watson', 'Whenever an individual or a business decides that success has been attained, progress stops.'),
  ('Jan van de Snepscheut', 'In theory, there is no difference between theory and practice. But, in practice, there is.'),
  ('Kent Beck', 'When you feel the need to write a comment, first try to refactor the code so that any comment becomes superfluous.'),
  ('Chinese Proverb', 'Tell me and I forget. Show me and I remember. Involve me and I understand.'),
  ('Aristotle', 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.');

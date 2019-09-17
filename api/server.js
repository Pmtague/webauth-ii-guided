const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const dbConnection = require('../database/dbConfig.js');

const server = express();

const sessionConfig = {
  name: 'goat', // Make name something unobvious
  secret: process.env.SESSION_SECRET || "Keep it secret, keep it safe",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false,
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: true, // GDPR compliance
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: 'knexsessions',
    createtable: true,
    clearInterval: 1000 * 60 * 30,
  }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;

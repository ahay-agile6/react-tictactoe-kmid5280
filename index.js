'use strict';
/*const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();*/
require('dotenv').config();
const express = require('express')
const cors = require('cors')
const {CLIENT_ORIGIN} = require('./config')

//construct server code

const morgan = require('morgan')
const app = express();
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
const passport = require('passport')
const { dbConnect } = require('./db-mongoose');
const { PORT, DATABASE_URL } = require('./config')
//const { router: usersRouter } = require('../users')
const statsRouter = require('./statsRouter')
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth')

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    if (req.method === 'OPTIONS') {
        return res.send(204)
    }
    next();
})

passport.use(localStrategy);
passport.use(jwtStrategy)
const jwtAuth = passport.authenticate('jwt', {session: false})


//app.use('/stats', statsRouter)
//app.use('/users', usersRouter)
app.get('/', (req,res) => {
  res.json('thisisastring')
})


app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);




function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };

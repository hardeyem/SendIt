import {load} from 'dotenv';
load();
import debug from 'debug';
import http from 'http';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import compression from 'compression';
import passport from 'passport';

import { apiRoutes } from './api/v1/api-routes';
import {connect} from './models/db';
import {userPassport} from './helpers/passport';

debug('SendIt:server');

// do db connection test
connect((err, client, done) => {
  done(); //close the connection
  if(err){
    console.log('Can not connect to database check your configuration');
  } else{
    console.log('Database connected');
  }
});

userPassport();

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3300');

const app = express();

app.disable('x-powered-by');//turn off header

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Enable CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT,GET,DELETE,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type, Accept, Authorization,' +
		' Access-Control-Allow-Credential');
  res.header('Access-Control-Allow-Credentials', 'true');

  next();
});

app.use(passport.initialize());
app.use(passport.session());


/**
 * API routes
 */
apiRoutes(app);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Catch unauthorised errors
app.use(function (err, req, res) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({'message': err.name + ': ' + err.message});
  }
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

module.exports = app; //not needed should be remove

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
  case 'EADDRINUSE':
    console.error(bind + ' is already in use');
    process.exit(1);
    break;
  default:
    throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  console.log('server listenting on port' + port);
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
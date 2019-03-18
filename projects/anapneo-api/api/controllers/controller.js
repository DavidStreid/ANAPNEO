'use strict';
const atob      = require('atob');
const env       = require('../../environment');
const http      = require('../../resources/constants/http');
const logger    = require('../../utils/logger');
const jwtUtil   = require('../../utils/jwt');

// DB APIs
const usersAccess     = require('../../mongo/users/usersAccess');
const advocateAccess  = require('../../mongo/advocate/advocateAccess');
const checkInsAccess  = require('../../mongo/checkIns/checkInsAccess');

/**
 * Returns pre-flight response
 */
exports.preFlight = function(req,res){
  logger.debug( 'PRE-FLIGHT REQUEST' );
  setCORSHeaders(res, ['POST', 'GET']);
  res.sendStatus(200);
};

/**
 * Returns CORS headers
 */
function setCORSHeaders(res, methods){
  res.setHeader('Access-Control-Allow-Origin', env.allowedOrigins.join(',') );
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', methods.join(','));
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,authorization,withcredentials');
}

/**
 * Determines location of token and returns it. Checks header, request body, and cookies
 * @param req - Request body from client
 * @returns {string}
 *
 * REF - https://gist.github.com/thebigredgeek/230368bd92aa19e3f6638b659edf5cef
 */
function getSessionToken(req) {
  logger.debug('controller::getSessionToken');
  let token;
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { // Authorization: Bearer g1jipjgi1ifjioj
    logger.debug(`AUTHORIZATION HEADER: ${JSON.stringify(req.headers.authorization)}`);
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query[http.sessionCookie];
    logger.debug(`Token in query: ${token}`);
  } else if (req.cookies && req.cookies[http.sessionCookie]) {
    token = req.cookies[http.sessionCookie];
    logger.debug(`Token in cookie: ${token}`);
  } else {
    logger.log('Token is not set on request');
  }

  const isValidToken = jwtUtil.verify(token);
  if( !isValidToken ){
    logger.log(`Nullifying bad token: ${token}`);
    return '';
  }

  return token;
}

/**
 * Returns health profile for user
 */
exports.getHealth = function(req,res){
  setCORSHeaders(res, ['GET'])
  logger.log('controller::getHealth');

  const token = getSessionToken(req);
  usersAccess.getHealth(token).then(function(result) {
    res.send(result);
  });
};

/**
 * Returns check-in data for user
 */
exports.getCheckIns = function(req,res){
  setCORSHeaders(res, ['GET'])
  logger.log('controller::getCheckIns');

  const token = getSessionToken(req);
  checkInsAccess.getUserCheckIns(token).then( function(checkIns) {
    if( checkIns == null || checkIns.length == 0 ) {
      logger.log( `No CheckIns found for user with token ${token}` );
      res.status(401).send( { checkIns: [] });
      return;
    }
    res.send({ checkIns });
  })
};

exports.updateCheckIn = function(req, res){
  logger.debug('controller::updateCheckIn');
  setCORSHeaders(res, ['GET']);

  const checkIn       = req.body.checkIn || {};
  const token         = getSessionToken(req);
  const advocateName  = req.body.advocate;
  return usersAccess.getUserIdFromToken(token)
    .then( (userId) => {
      return advocateAccess.getAdvocateIdFromName(advocateName).then( (advocateId) => {
        checkInsAccess.updateCheckIn(checkIn, userId, advocateId).then(function (status) {
          res.send({status});
        });
      })
      .catch( (err) => {
        logger.log(err); res.status(500).send({ status: err} ) } );
    });
};

/**
 * Submits a new check-in for the user's profile
 */
exports.submitPending = function(req,res){
  logger.debug('controller::submitPending');
  setCORSHeaders(res, ['POST'])

  const checkIn       = req.body.checkIn || {};
  const token         = getSessionToken(req);
  const advocateName  = req.body.advocateName;
  return usersAccess.getUserIdFromToken(token)
    .then(  (userId) => {
      return advocateAccess.getAdvocateIdFromName(advocateName).then( (advocateId) => {
        checkInsAccess.addPendingCheckIn(checkIn, userId, advocateId).then(function (status) {
                                                                  logger.debug(`Status: ${status}`);
                                                                  res.send({ status });
                                                                });
      })
    .catch( (err) => {
      logger.log(err); res.status(500).send({ status: err} ) } );
    });
};

exports.login = function(req,res){
  logger.log('controller::login');
  setCORSHeaders(res, ['POST']);

  const asciiName = req.body.userId;
  const asciiPassword = req.body.pwd;

  // Converts to binary representation of string
  const password = atob(asciiPassword);
  const name = atob(asciiName);

  usersAccess.login(name, password).then(function(loginStatus) {
    // Set the user token in the headers
    const token = loginStatus[ 'token' ];
    const body = {};

    if( loginStatus[ 'success' ] ){
      // If successful, we'll send the session token once so it can be saved into the browser cookies. Why? Safari...
      logger.log('Setting the token in the response');
      body[ 'session' ] = token;
    } else {
      res.status(401);
      logger.log(`Login Failed: ${loginStatus['status']} - User: ${name}, Password: ${password}`);
    }

    body[ 'success']  = loginStatus[ 'success' ];
    body[ 'status' ]  = loginStatus[ 'status' ];

    res.send( body );
  });
};

'use strict';
var request = require('request');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var atob = require('atob');
var logger = require('../../utils/logger');
var env = require('../../environment');

// DB APIs
var usersAccess   = require('../../mongo/users/usersAccess');
var vendorAccess  = require('../../mongo/vendor/vendorAccess');
var checkInsAccess = require('../../mongo/checkIns/checkInsAccess');
var http   = require('../../resources/constants/http');


// REF - https://gist.github.com/thebigredgeek/230368bd92aa19e3f6638b659edf5cef
function getSessionToken(req) {
  logger.debug('controller::getSessionToken');
  var token;
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { // Authorization: Bearer g1jipjgi1ifjioj
    token = req.headers.authorization.split(' ')[1];
    logger.debug(`Token in authorization header: ${token}`);
  } else if (req.query && req.query.token) {
    token = req.query[http.sessionCookie];
    logger.debug(`Token in query: ${token}`);
  } else if (req.cookies && req.cookies[http.sessionCookie]) {
    token = req.cookies[http.sessionCookie];
    logger.debug(`Token in cookie: ${token}`);
  } else {
    logger.log('Token is not set on request');
  }
  return token;
}
/*
  We do not add 'HttpOnly' to the cookie if 3rd-party cookies are not allowed by the browser.
  In that case, cookies need to be available in the browser in order to send the JWT token
*/
function setSessionToken(res, token, httpOnly){
  logger.debug('controller::setSessionToken');
  logger.log(`Setting session token to ${token}`);

  var cookies = [`${http.sessionCookie}=${token}`];
  if( httpOnly ){
    logger.debug('Sending cookie as httpOnly');
    cookies = cookies.concat('; HttpOnly');
  }

  res.setHeader('Set-Cookie', cookies);
}

// TODO - add handleError to places
exports.getHealth = function(req,res){
  setCORSHeaders(res, ['GET'])
  logger.log('controller::getHealth');

  const token = getSessionToken(req);
  usersAccess.getHealth(token).then(function(result) {
    res.send(result);
  });
}

exports.preFlight = function(req,res){
  logger.debug( 'PRE-FLIGHT REQUEST' );
  setCORSHeaders(res, ['POST', 'GET']);
  res.sendStatus(200);
}

exports.getCheckIns = function(req,res){
  setCORSHeaders(res, ['GET'])
  logger.log('controller::getCheckIns');

  const token = getSessionToken(req);
  checkInsAccess.getUserCheckIns(token).then( function(checkIns) {
    if( checkIns == null || checkIns.length == 0 ) {
      logger.log( `No CheckIns found for user with token ${token}` );
      res.send( { checkIns: [] });
      return;
    }
    res.send({ checkIns });
  })
}

exports.submitPending = function(req,res){
  logger.debug('controller::submitPending');
  setCORSHeaders(res, ['POST'])

  const checkIn       = req.body.checkIn || {};
  const token         = getSessionToken(req);
  const advocateName  = req.body.advocateName;
  return usersAccess.getUserIdFromToken(token)
    .then(  (userId) => {
      return vendorAccess.getAdvocateIdFromName(advocateName).then( (advocateId) => {
        checkInsAccess.addPendingCheckIn(checkIn, userId, advocateId).then(function (status) {
                                                                  logger.debug(`Status: ${status}`);
                                                                  res.send({ status });
                                                                });
      })
    .catch( (err) => {
      logger.log(err); res.send({ status: err} ) } );
    });
}

exports.updateCheckIn = function(req, res){
  logger.debug('controller::updateCheckIn');

  setCORSHeaders(res, ['GET']);

  const checkIn       = req.body.checkIn || {};
  const token         = getSessionToken(req);
  const advocateName  = req.body.advocate;
  return usersAccess.getUserIdFromToken(token)
    .then( (userId) => {
      return vendorAccess.getAdvocateIdFromName(advocateName).then( (advocateId) => {
        checkInsAccess.updateCheckIn(checkIn, userId, advocateId).then(function (status) {
                                                                  res.send({status});
                                                                });
      })
    .catch( (err) => {
      logger.log(err); res.send({ status: err} ) } );
    });
}

exports.getVendors = function(req,res){
    setCORSHeaders(res, ['GET'])
    logger.log('controller::getVendors');

    const token = getSessionToken(req);
    usersAccess.isValidSession(token).then(result => {
      if( result.success ){
        // TODO - Make vendor list dependent on the userId that comes in, get zipcode
        const userId = req.query.userId || null;
        if(! userId){ return handleError('UserID not provided', res, 404); }
        const zipCode = 11216;

        // TODO - refactor
        queryDBandSend(zipCode, res);
      } else {
        res.send({result})
      }
    })
}

// TODO - split into queryDB & sendResp functions
function queryDBandSend( zipCode, res ){
    res.contentType('application/json');

    var vendorModel = mongoose.model('vendor')
    var vendorList = [];
    vendorModel.find({ zipCode }, function (err, vendors) {
        // Error Case
        if (err) {
            logger.log('ERROR: ' + name);
            errors.push( { name, err } );
            return;
        }
        // Null vendor case
        else if ( !vendors ) {
            logger.log('NULL VENDOR: ' + name);
            errors.push( { name, err: 'No vendor data for ' + name } );
            return;
        }

        vendors = vendors.map(obj =>{
            const name      = obj['name'] || 'NO_NAME';
            const imgObj    = obj['img'] || {};
            const img       = imgObj['data'] || {};

            return { name, img };
        });

        vendorList = vendors;
        const data = { vendors: vendorList };

        res.send(data);
    });
}
exports.getImg = function(req,res){
    logger.log('controller::getImg');

    setCORSHeaders(res, ['GET']);

    const name = req.query.name || '';
    if(! name){
        return handleError('Name of vendor not specified', res, 404);
    }

    // img schema
    var schema = new Schema({
        img: { data: Buffer, contentType: String }
    });
    var vendorModel = mongoose.model('vendor')
    var vendorDoc = new vendorModel;

    logger.log('querying for ' + name);

    vendorModel.findOne({ name }, function (err, vendor) {
        if (err) return handleError(err, res, 500);
        if (!vendor) return handleError('No vendor data for ' + name, res, 404);

        const img = vendor.img || {};
        const contentType = img['contentType'] || 'NO CONTENT TYPE';
        const data = img['data'] || 'NO DATA';

        res.contentType(contentType);
        res.send(data);
    });
}

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

    if( loginStatus[ 'success' ] && token ){
      const makeCookiesAvailable = req.body[ 'setHttpOnly' ] || false;
      console.log(`makeCookiesAvailable: ${makeCookiesAvailable}`);
      setSessionToken(res, token, makeCookiesAvailable);
    } else {
      logger.log(`Login Failed: ${loginStatus['status']} - User: ${name}, Password: ${password}`);
    }

    body[ 'success']  = loginStatus[ 'success' ];
    body[ 'status' ]    = loginStatus[ 'status' ];

    res.send( body );
  });
}

exports.getPrescriptions = function(req,res){
    logger.log('controller::getPrescriptions');
    setCORSHeaders(res, ['GET']);

    // TODO - Parse out and validate authentication token

    // TODO - Get Prescriptions from DB
    const prescriptions = [
      {
        name: 'MultiVitamin',
        qty: 1,
        frequency: 'daily'
      },
      {
        name: 'NicodermCQ',
        qty: 1,
        frequency: 'daily'
      }
    ];

    res.send({ prescriptions });
}

exports.getDoctors = function(req,res){
  logger.log('controller::getDoctors');
  setCORSHeaders(res, ['GET']);

  // TODO - Parse out and validate authentication token

  // TODO - Get Prescriptions from DB
  const doctors = [
      {
        name: 'Eric Toig',
        type: 'Primary Care'
      },
      {
        name: 'House',
        type: 'Oncologist'
      }
    ];
  res.send({ doctors });
}


exports.textPost = function(req,res){
  logger.log('controller::textPost')
  setCORSHeaders(res, ['POST']);
  const text = req.body.text;
  res.send({'text': text});
}

exports.helloWorld = function(req, res){
  logger.log('controller::helloWorld')
  setCORSHeaders(res, ['GET']);
  res.send({'text': 'Hello World!'});
}

function setCORSHeaders(res, methods){
  // Returns CORS headers in pre-flight request
  res.setHeader('Access-Control-Allow-Origin', env.allowedOrigins.join(',') );
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', methods.join(','));
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,authorization,withcredentials');
}

function handleError(message, resp, statusCode){
    logger.log('ERROR: ' + message);

    const body = { 'error': message }
    if(statusCode){
        resp.status(statusCode);
    } else {
        resp.status(404);
    }
    resp.send(body);
}

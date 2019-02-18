'use strict';
var request = require('request');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var atob = require('atob');
var logger = require('../../utils/logger');

// DB APIs
var usersAccess   = require('../../mongo/users/usersAccess');
var vendorAccess  = require('../../mongo/vendor/vendorAccess');
var checkInsAccess = require('../../mongo/checkIns/checkInsAccess');

var http   = require('../../resources/constants/http');
var logging_enabled = true;
var allowedOrigins = ['*'];                                 // valid hosts for CORS

// TODO - add handleError to places
exports.getHealth = function(req,res){
  setCORSHeaders(res, allowedOrigins, ['GET'])
  logger.log('controller::getHealth');

  const token = req.query.token || null;

  usersAccess.getHealth(token).then(result => {
    res.send(result);
  });
}

exports.getCheckIns = function(req,res){
  setCORSHeaders(res, allowedOrigins, ['GET'])
  logger.log('controller::getCheckIns');

  const token = req.query.token || null;
  checkInsAccess.getUserCheckIns(token).then( checkIns => {
    if( checkIns == null || checkIns.length == 0 ) {
      logger.log( `No CheckIns found for user with token ${token}` );
      res.send( { checkIns: [] });
      return;
    }
    res.send({ checkIns });
  })
}

exports.submitPendingOptions = function(req,res){
  logger.debug( 'PRE-FLIGHT REQUEST - submitPending' );

  setCORSHeaders(res, allowedOrigins, ['POST']);
  console.log(http.responses.get(200));
  res.sendStatus(200);
}

exports.submitPending = function(req,res){
  logger.debug('controller::submitPending');
  setCORSHeaders(res, allowedOrigins, ['POST'])

  const checkIn       = req.body.checkIn || {};
  const token         = req.body.token;
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

exports.updateCheckInOptions = function(req,res){
  logger.debug( 'PRE-FLIGHT REQUEST - updateCheckIn' );

  setCORSHeaders(res, allowedOrigins, ['POST']);
  console.log(http.responses.get(200));
  res.sendStatus(200);
}

exports.updateCheckIn = function(req, res){
  logger.debug('controller::updateCheckIn');

  setCORSHeaders(res, allowedOrigins, ['GET'])
  const checkIn       = req.body.checkIn || {};
  const token         = req.body.token;
  const advocateName  = req.body.advocate;

  return usersAccess.getUserIdFromToken(token)
    .then(  (userId) => {
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
    setCORSHeaders(res, allowedOrigins, ['GET'])
    logger.log('controller::getVendors');

    const token = req.query.token || null;

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

    setCORSHeaders(res, allowedOrigins, ['GET']);

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

exports.loginOptions = function(req,res){
    // Handles pre-flight request textPost
    logger.log( 'PRE-FLIGHT REQUEST - login' );

    setCORSHeaders(res, allowedOrigins, ['POST']);
    console.log(http.responses.get(200));
    res.sendStatus(200);
}

exports.login = function(req,res){
  logger.log('controller::login');

  setCORSHeaders(res, allowedOrigins, ['POST']);

  const asciiName = req.body.userId;
  const asciiPassword = req.body.pwd;

  // Converts to binary representation of string
  const password = atob(asciiPassword);
  const name = atob(asciiName);

  usersAccess.login(name, password).then((loginStatus) => {
    logger.log(`${loginStatus['status']} - User: ${name}, Password: ${password}`);
    res.send( loginStatus );
  });
}

exports.getPrescriptions = function(req,res){
    logger.log('controller::getPrescriptions');
    setCORSHeaders(res, allowedOrigins, ['GET']);

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
  setCORSHeaders(res, allowedOrigins, ['GET']);

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
  setCORSHeaders(res, allowedOrigins, ['POST']);
  const text = req.body.text;
  res.send({'text': text});
}

exports.textPostOptions = function(req,res){
  // Handles pre-flight request textPost
  setCORSHeaders(res, allowedOrigins, ['POST']);
  res.sendStatus(200);
}

exports.helloWorld = function(req, res){
  logger.log('controller::helloWorld')
  setCORSHeaders(res, allowedOrigins, ['GET']);
  res.send({'text': 'Hello World!'});
}

function setCORSHeaders(res, origins, methods){
  // Returns CORS headers in pre-flight request
  res.setHeader('Access-Control-Allow-Origin', origins.join(',') );
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', methods.join(','));
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
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

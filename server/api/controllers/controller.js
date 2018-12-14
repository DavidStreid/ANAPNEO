'use strict';
var request = require('request');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var http   = require("../../resources/constants/http");
var db = require('../../mongo/db');

var logging_enabled = true;
var allowedOrigins = ["*"];                                 // valid hosts for CORS

// TODO - add handleError to places

db.connect('mongodb://localhost:27017/test', function(err) {
  if (err) {
    console.log(JSON.stringify(err));
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    console.log('Mongo listening on port 27017...')
  }
})

exports.getVendors = function(req,res){
    log("controller::getVendors");

    // TODO - Make vendor list dependent on the userId that comes in, get zipcode
    const userId = req.query.userId || null;
    if(! userId){ return handleError('UserID not provided', res, 404); }
    const zipCode = 11216;

    queryDBandSend(zipCode, res);
}

// TODO - split into queryDB & sendResp functions
function queryDBandSend( zipCode, res ){
    var vendorModel = mongoose.model('vendor')

    var vendorList = [];
    vendorModel.find({ zipCode }, function (err, vendors) {
        // Error Case
        if (err) {
            log('ERROR: ' + name);
            errors.push( { name, err } );
            return;
        }
        // Null vendor case
        else if ( !vendors ) {
            log('NULL VENDOR: ' + name);
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

        res.contentType('application/json');
        setCORSHeaders(res, allowedOrigins, ["GET"]);
        res.send(data);
    });
}
exports.getImg = function(req,res){
    log("controller::getImg");

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


    log('\tquerying img for ' + name);


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
    log( "PRE-FLIGHT REQUEST - login" );

    setCORSHeaders(res, allowedOrigins, ["POST"]);
    console.log(http.responses.get(200));
    res.sendStatus(200);
}

exports.login = function(req,res){
  log("controller::login");
  setCORSHeaders(res, allowedOrigins, ["POST"]);

  // TODO - Create application token based off of login-info
  const authToken = Math.floor(Math.random()*1000000000000);

  res.send({ authToken });
}

exports.getPrescriptions = function(req,res){
    log("controller::getPrescriptions");
    setCORSHeaders(res, allowedOrigins, ["GET"]);

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
  log("controller::getDoctors");
  setCORSHeaders(res, allowedOrigins, ["GET"]);

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
  log("controller::textPost")
  setCORSHeaders(res, allowedOrigins, ["POST"]);
  const text = req.body.text;
  res.send({'text': text});
}

exports.textPostOptions = function(req,res){
  // Handles pre-flight request textPost
  log( "PRE-FLIGHT REQUEST - textPost" );
  setCORSHeaders(res, allowedOrigins, ["POST"]);
  console.log(http.responses.get(200));
  res.sendStatus(200);
}

exports.helloWorld = function(req, res){
  log("controller::helloWorld")
  setCORSHeaders(res, allowedOrigins, ["GET"]);
  res.send({'text': 'Hello World!'});
}

function setCORSHeaders(res, origins, methods){
  // Returns CORS headers in pre-flight request
  res.setHeader("Access-Control-Allow-Origin", origins.join(",") );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader('Access-Control-Allow-Methods', methods.join(","));
  res.setHeader("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
}

function log(msg){
    if( logging_enabled ){
        console.log(msg);
    }
}

function handleError(message, resp, statusCode){
    log('ERROR: ' + message);

    const body = { 'error': message }
    if(statusCode){
        resp.status(statusCode);
    } else {
        resp.status(404);
    }
    resp.send(body);
}
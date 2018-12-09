'use strict';
var request = require('request');
var http   = require("../../resources/constants/http");
var db = require('../../mongo/db');
var logging_enabled = true;
var allowedOrigins = ["*"];                                 // valid hosts for CORS

db.connect('mongodb://localhost:27017/test', function(err) {
  if (err) {
    console.log(JSON.stringify(err));
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    console.log('Mongo listening on port 27017...')
  }
})


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

exports.getVendors = function(req,res){
  log("controller::getVendors");
  setCORSHeaders(res, allowedOrigins, ["GET"]);

  // TODO - Parse out and validate authentication token

  // TODO - Get vendors from DB
  const vendors = [
    {
        name: 'CVS'
    },
    {
        name: 'Walgreens'
    }
  ];

  res.send({'vendors': vendors});
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
function log(msg){
    if( logging_enabled ){
        console.log(msg);
    }
}
}
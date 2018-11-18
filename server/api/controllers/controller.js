'use strict';
var request = require('request');
var http   = require("../../resources/constants/http");
var db = require('../../../db/db');
var logging_enabled = true;
var allowedOrigins = ["*"];   // valid hosts for CORS

db.connect('mongodb://localhost:27017/test', function(err) {
  if (err) {
    console.log(JSON.stringify(err));
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    console.log('Mongo listening on port 27017...')
  }
})

exports.textPost = function(req,res){
  if(logging_enabled) console.log("controller::textPost")
  setCORSHeaders(res, allowedOrigins, ["POST"]);
  const text = req.body.text;
  res.send({'text': text});
}

exports.textPostOptions = function(req,res){
  // Handles pre-flight request textPost
  if(logging_enabled) console.log( "PRE-FLIGHT REQUEST - textPost" );
  setCORSHeaders(res, allowedOrigins, ["POST"]);
  console.log(http.responses.get(200));
  res.sendStatus(200);
}

exports.helloWorld = function(req, res){
  if(logging_enabled) console.log("controller::helloWorld")
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
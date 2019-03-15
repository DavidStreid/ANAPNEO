// REF - https://medium.com/@siddharthac6/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e
var jwt     = require('jsonwebtoken');
const path  = require("path");
var fs      = require('fs');

var env     = require('../environment');
var logger  = require('./logger');

var privateKEY  = fs.readFileSync(path.resolve(__dirname,'./private.key'));
var publicKEY   = fs.readFileSync(path.resolve(__dirname,'./public.key'));

var i  = 'DavidStreid';                 // Issuer
var s  = 'y.fret.internet@gmail.com';   // Subject
var a  = env.allowedOrigins[0];         // Audience
var e = '12h';
var algo = 'RS256';                     // RSASSA [ "RS256", "RS384", "RS512" ]
var signOptions = {
  issuer:  i,
  subject:  s,
  audience:  a,
  expiresIn:  e,
  algorithm:  algo
};
var verifyOptions = {
  audience: a,
  issuer: i,
  subject: s,
  algorithms: [ algo ]
};

exports.sign = function(payload) {
  logger.debug(`Signing Token - Subject: ${s}, Issuer: ${i}, Audience: ${a}, Expiration: ${e}, Algo: ${algo}`)
  return jwt.sign(payload, privateKEY, signOptions);
}

exports.verify = function(token){
  var isValidToken = jwt.verify(token, publicKEY, verifyOptions);
  return isValidToken;
}


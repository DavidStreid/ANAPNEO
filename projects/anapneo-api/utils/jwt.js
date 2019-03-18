// REF - https://medium.com/@siddharthac6/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e
const jwt     = require('jsonwebtoken');
const path  = require("path");
const fs      = require('fs');

const environment = require('../environment');
const logger      = require('./logger');

const privateKEY  = fs.readFileSync(path.resolve(__dirname,'./private.key'));
const publicKEY   = fs.readFileSync(path.resolve(__dirname,'./public.key'));

const i  = 'DavidStreid';                 // Issuer
const s  = 'y.fret.internet@gmail.com';   // Subject
const a  = environment.allowedOrigins[0]; // Audience
const e = '12h';
const algo = 'RS256';                     // RSASSA [ "RS256", "RS384", "RS512" ]
const signOptions = {
  issuer:  i,
  subject:  s,
  audience:  a,
  expiresIn:  e,
  algorithm:  algo
};
const verifyOptions = {
  audience: a,
  issuer: i,
  subject: s,
  algorithms: [ algo ]
};

/**
 * Signs login payload w/ JWT
 *
 * @returns string - JWT
 */
exports.sign = function(payload) {
  logger.debug(`Signing Token - Subject: ${s}, Issuer: ${i}, Audience: ${a}, Expiration: ${e}, Algo: ${algo}`)
  return jwt.sign(payload, privateKEY, signOptions);
};

/**
 * Verifies JWT has valid signature
 *
 * @returns boolean
 */
exports.verify = function(token){
  return jwt.verify(token, publicKEY, verifyOptions);
};


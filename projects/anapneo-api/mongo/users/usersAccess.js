var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const path = require("path");
var logger = require("../../utils/logger");

const loggingEnabled = true;

const userModel = getUserModel();

exports.removeUsers = function() {
  logger.debug('userAccess::removeUsers')

  const userModel = mongoose.model('user')

  userModel.deleteMany(function (err) {
    if (err) throw err;
  });
  console.error('Removed users from user collection');
}

var addUser = function(name, password, type) {
  logger.debug('userAccess::addUser');

  // Create & save user
  var userDoc = createUserDoc(name, password, type);
  userDoc.save(function (err) {
     if (err) return handleError(err);
     console.log('saved ' + userDoc.name + ' to users collection');
  });
}

exports.addUser = addUser;

/**
 * Saves a temporary token to the user profile. All requests for sensitive data
 * will require this token
 */
function saveUserToken(name, password, token){
  logger.debug('userAccess::saveUserToken');

  var conditions = { name }
    , update = { $set: { token, loginTS: new Date() }}
    , options = { multi: false };

  function callback (err, numAffected) {
    if(err) {
      logger.log(err);
    } else {
      logger.log(`Saved login token for user ${name}`);
    }
  }

  userModel.updateOne(conditions, update, options, callback);
}

exports.login = function(name, password) {
  logger.debug('userAccess::login');

  var userModel = mongoose.model('user');
  return userModel.findOne({ name }).then((result) => {
    if( result != null ){
      var storedPassword = result[ 'password' ] || null;
      if( password == storedPassword ){
        logger.log(`Login Success - User: ${name}, Password: ${password}, Old Token: ${result[ 'token' ] || 'NOT_DEFINED'}`);
        var token = Math.floor(Math.random()*1000000000000);

        saveUserToken( name, password, token );
        return {
                  success: true,
                  status: 'User and password are correct',
                  token }
      }
      logger.log(`Login fail: Username and password do not match ( User: ${name}, Password: ${password} )`)
      return { status: 'User and password do not match', success: false }
    }
    logger.log(`Login fail: User not found - ${name}`)
    return { status: 'User not found', success: false }
  });
}

/*
    Creates a vendor doc, a model instance given the input schema
      name:     Name of User
      password: User's password
      role:     Role of user, i.e. patient/advocate/doctor
 */
function createUserDoc(name, password, role){
  // Create document instance for vendor
  var userDoc = new userModel;

  userDoc.name = name;
  userDoc.password = password;
  userDoc.role = role;

  return userDoc;
}

function isValidSession( token ){
  var expiryTime = 1800000; // 30 minutes - 1000 * 60 * 30

  var userModel = mongoose.model('user');

  let status;

  return userModel.findOne({ token }).then((result) => {
    if( result == null ){
      status = `User profile with token ${token} was not found`;
      logger.log(status);
      return { status, success: false };
    }


    var loginTS = result[ 'loginTS' ] || null;

    // Valid login timestamp that does not exceed the expiry time
    if( loginTS && expiryTime > new Date(new Date().getTime()-(expiryTime)) ){
      status = `User profile with token ${token} is valid`;
      logger.log(status);
      return { status, success: true };
    }
    status = `User profile with token ${token} is has expired`;
    logger.log(status);
    return { status, success: false };
  });
}

exports.isValidSession = isValidSession;

function getUserModel(){
    // Model of users
    const userData = new Schema({
        name: String,
        password: String,
        role: String,
        token: String,      // This token is used to provide access to the application and will be sent with each request
        loginTS: Date       // This tracks the login time of a user
    });
    const userModel = mongoose.model('user', userData);

    return userModel;
}

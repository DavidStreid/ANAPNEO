var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const path = require("path");
var logger = require("../../utils/logger");

const loggingEnabled = true;

const userModel = getUserModel();

exports.getCheckIns = function(token) {
  logger.debug('userAccess::getCheckIns');

  return findUser(token).then((user) => {
    if( user != null ){
      var checkIns = user['checkIns'] || [];
      logger.log( `Retrieved user checkIns for ${getUserString(user)} - CheckIns: ${JSON.stringify(checkIns)}` );
      return { checkIns };
    } else {
      return { checkIns: [] };
      logger.log( `No user found for token ${token}` );
    }
  });
}

exports.removeUsers = function() {
  logger.debug('userAccess::removeUsers');

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
      logger.log(`Saved login token for user ${name}: ${token}`);
    }
  }

  userModel.updateOne(conditions, update, options, callback);
}

exports.login = function(name, password) {
  logger.debug('userAccess::login');

  var userModel = mongoose.model('user');
  return userModel.findOne({ name }).then((userDoc) => {
    if( userDoc != null ){
      var storedPassword = userDoc[ 'password' ] || null;
      if( password == storedPassword ){
        var token = userDoc[ 'token' ];
        logger.log(`Login Success - User: ${name}, Password: ${password}, Old Token: ${token}`);

        // Re-assign token if needed
        if( isLoginExpired(userDoc) || token == null ){
          logger.log('Token is null or expired - creating a new one...');

          // TODO - Token creation
          token = Math.floor(Math.random()*1000000000000);
          saveUserToken( name, password, token );
        } else {
          logger.log('Re-using token');
        }

        return {
                  success: true,
                  status: 'User and password are correct',
                  token }
      }
      // password doesn't match
      logger.log(`Login fail: Username and password do not match ( User: ${name}, Password: ${password} )`)
      return { status: 'User and password do not match', success: false }
    }
    // User doesn't exist
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
  return userModel.findOne({ token }).then((userDoc) => {
    if( userDoc == null ){
      status = `User profile with token ${token} was not found`;
      logger.log(status);
      return { status, success: false };
    }
    if(isLoginExpired(userDoc)){
      status = `User profile with token ${token} has expired`;
      logger.log(status);
      return { status, success: false };
    }
    status = `User profile with token ${token} is valid`;
    logger.log(status);
    return { status, success: true };
  });
}

/**
 * This method uses a uniquely identifying token to return the user doc
 */
function findUser(token){
  return userModel.findOne({ token }).then((userDoc) => {
    if( userDoc == null ){
      status = `User profile with token ${token} was not found`;
      logger.log(status);
      return null;
    }
    if(isLoginExpired(userDoc)){
      status = `User profile with token ${token} has expired`;
      logger.log(status);
      return null;
    }
    status = `User profile with token ${token} is valid`;
    logger.log(status);
    return userDoc;
  });
}

/**
 * This function determines if a userDoc has a non-expired login time
 */
function isLoginExpired(userDoc) {
  var loginTS = userDoc[ 'loginTS' ] || null;

  var validTimeFrame = 1800000; // 30 minutes - 1000 * 60 * 30
  var expiryTime = new Date(new Date().getTime()-(validTimeFrame));

  // Valid login timestamp that does not exceed the expiry time
  if( loginTS && loginTS > expiryTime ){
    return false;
  }
  return true;
}

exports.isValidSession = isValidSession;

function getUserModel(){
    // Model of users
    const userData = new Schema({
        name: String,
        password: String,
        role: String,
        token: String,      // This token is used to provide access to the application and will be sent with each request
        loginTS: Date,      // This tracks the login time of a user
        checkIns: Array
    });
    const userModel = mongoose.model('user', userData);

    return userModel;
}

function getUserString(userDoc) {
  var name = userDoc['name'] || 'NO_NAME';
  var password = userDoc['password'] || 'NO_PASSWORD';
  var token = userDoc['token'];

  return `Name: ${name}, Password: ${password}, Token: ${token}`;
}

exports.removeUsers = function() {
    logger.log("userAccess::removeUsers");
    const userModel = mongoose.model('user')

    userModel.deleteMany(function (err) {
        if (err) throw err;
    });
    console.error('Removed users from user collection');
}

exports.addMockUser = function() {
  // TODO - Add constants
  // TODO - Better data model (Seperate User, Advocates, Check-In Data, etc.)
  logger.debug('userAccess::addMockUser');

  var userDoc = new userModel;

  userDoc.name = 'DavidStreid';
  userDoc.password = 'test';
  userDoc.role = 'patient';

  // TODO - Should be a map
  userDoc.checkIns = [
    {
      name: 'Suite V Brooklyn',
      type: 'barber',
      address: {
        street: '775 Nostrand Ave',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: 11216
      },
      services: [ 'Hypertension Screening' ],
      appointments: [
        {
          contact: 'David Streid',
          type: 'Haircut',
          date: {
            day: 24,
            month: 12,
            year: 2018
          },
          checkedIn: true,
          checkInData: {
            'Blood Pressure': {
              'systolic': 120,
              'diastolic': 80
            }
          }
        },
        {
          contact: 'David Streid',
          type: 'Haircut',
          date: {
            day: 30,
            month: 1,
            year: 2019
          },
          checkedIn: false
        } ]
    } ];

  userDoc.save(function (err) {
     if (err) return console.log(err);
     console.log('saved ' + userDoc.name + ' to users collection');
  });
}

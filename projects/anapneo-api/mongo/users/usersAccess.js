var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const path = require("path");
var logger = require("../../utils/logger");
var vendor = require("../vendor/vendorAccess");
var jwtUtil = require('../../utils/jwt');

const userModel = getUserModel();

/**
 * Returns User Model
 */
exports.getUserModel = function() {
  return userModel;
}

/**
 * Returns health profile for a user identified by input token
 */
exports.getHealth = function(token) {
  logger.debug('userAccess::getHealth');

  return findUser(token, 'checkIns')
    .then( function(user) {
      if( user != null ){
        var healthProfile = user['healthProfile'] || {};
        var checkIns      = user['checkIns'] || [];
        var res           = { healthProfile, checkIns: checkIns };

        logger.debug( `Retrieved health data for ${getUserString(user)}: ${JSON.stringify(res)}` );
        return res;
      } else {
        logger.log( `No user found for token ${token}` );
        return { healthProfile: [], checkIns: [] };
      }
    });
}

/**
 *  Formats checkIns data stored for service respone
 *
 *  INPUT:
 *        CheckIns: [ {
 *          advocate: ...,
 *          appointments: [ {  ...
 *                             checkedInData: [ { ..., type: ... } ]
 *                           } ]
 *        }
 *
 *   OUTPUT:
 *       CheckIns: [ { type: [] }, ...  ]
 */
function getCheckInByType(checkIns){
  // Convert from mongoose doc to object
  var checkInsObj = checkIns.toObject();

  // Add initial object to be reduced, or element to be reduced if input is empty
  checkInsObj.unshift({});

  var checkInsByType = checkInsObj.reduce( function(checkInsByType, vendorCheckIn) {
    let appointments = vendorCheckIn[ 'appointments' ] || [];

    appointments.forEach( function (appt) {
      let date = appt[ 'date' ] || {};
      let checkInData = appt[ 'checkInData' ] || [];

      checkInData.forEach( function (cid) {
        let type = cid[ 'type' ] || 'INVALID_TYPE';
        let data = cid[ 'data' ] || {};
        let datapoint = { date,  data };

        if (type in checkInsByType) {
          checkInsByType[ type ].push( datapoint );
        } else {
          checkInsByType[ type ] = [ datapoint ];
        }
      });
    } );

    return checkInsByType;
  });

  return checkInsByType;
}

/**
 * Gets CheckIns of a user identified by input token
 */
exports.getCheckIns = function(token) {
  logger.debug('userAccess::getCheckIns');

  return findUser(token).then( function(user) {
    if( user != null ){
      var checkIns = user['checkIns'] || [];
      logger.log( `Retrieved user checkIns for ${getUserString(user)} - CheckIns: ${JSON.stringify(checkIns)}` );
      return { checkIns };
    } else {
      logger.log( `No user found for token ${token}` );
      return { checkIns: [] };
    }
  });
}

/**
 * Returns the userId for the user of a unique token
 *
 * @return - Schema.Types.ObjectId
 */
exports.getUserIdFromToken = function(token) {
  logger.debug('userAccess::getUserIdFromToken');
  return findUser(token).then( function (userDoc, err) {
    if( err ) {
      logger.log('No id found for invalid token');
      throw( err);
    }
    logger.log(`UserDoc id: ${userDoc._id} was retrieved from token ${token}`);
    return userDoc._id;
  });
}


/**
 * This method uses a uniquely identifying token to return the user doc
 *
 * @token - Token used for identification
 * @populateFields - String of fields to populate
 */
function findUser(token, populateFields = ''){
  logger.debug('userAccess::findUser');

  return userModel
    .findOne({ token })
    .populate(populateFields)
    .then((userDoc) => {
      if( userDoc == null ){
        status = `User profile with token ${token} was not found`;
        logger.log(status);
        return null;
      }
      // TODO - set expire on cookie
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
exports.findUser = findUser;

exports.removeUsers = function() {
  logger.debug('userAccess::removeUsers');
  const userModel = mongoose.model('user')
  return userModel.deleteMany();
}

var addUser = function(name, password, type) {
  logger.debug('userAccess::addUser');

  // Create & save user
  var userDoc = createUserDoc(name, password, type);
  userDoc.save(function (err) {
     if (err) return handleError(err);
     logger.log('saved ' + userDoc.name + ' to users collection');
  });
}
exports.addUser = addUser;

/**
 * Saves a temporary token to the user profile. All requests for sensitive data
 * will require this token
 *
 * @name, String - User name
 * @password, String - Password for user's account
 * @token, String - token for session
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
  return userModel.findOne({ name }).then(function (userDoc) {
    if( userDoc != null ){
      var storedPassword = userDoc[ 'password' ] || null;
      if( password == storedPassword ){
        var token = userDoc[ 'token' ];
        logger.log(`Login Success - User: ${name}, Password: ${password}, Old Token: ${token}`);

        // Re-assign token if needed
        if( isLoginExpired(userDoc) || token == null ){
          logger.log('Token is null or expired - creating a new one...');

          var payload = {
            name: userDoc.name,
            password: userDoc.password
          }

          token = jwtUtil.sign(payload);
          saveUserToken( name, password, token );
        } else {
          logger.log('Re-using token');
        }

        return {  success: true, status: 'User and password are correct', token }
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

function getUserString(userDoc) {
  var name = userDoc['name'] || 'NO_NAME';
  var password = userDoc['password'] || 'NO_PASSWORD';
  var token = userDoc['token'];

  return `Name: ${name}, Password: ${password}, Token: ${token}`;
}

exports.removeUsers = function() {
    logger.log("userAccess::removeUsers");
    const userModel = mongoose.model('user')
    return userModel.deleteMany();
}

/**
 * Returns Mongoose model for user
 */
function getUserModel(){
    // Model of users
    const userData = new Schema({
        _id: { type: Schema.ObjectId, auto: true },
        name: String,
        password: String,
        role: String,
        token: String,      // This token is used to provide access to the application and will be sent with each request
        loginTS: Date,      // This tracks the login time of a user
        healthProfile: Object,
        checkIns: [ { type: Schema.Types.ObjectId, ref: 'checkIn' } ]
    });
    const userModel = mongoose.model('user', userData);

    return userModel;
}

/**
 * Adds Mock Users to mongodb
 */
exports.addMockUser = function(name) {
  // TODO - Add constants
  logger.debug('userAccess::addMockUser');
  var checkIns = [];
  var healthProfile = {
    prescriptions: {
      'MultiVitamin': {
        qty: 1,
        frequency: 'daily'
      },
      'Diuretics': {
        qty: 1,
        frequency: 'daily'
      }
    },
    doctors: {
      primary: 'Eric Toig'
    }
  }
  var userDoc = createUserDoc(name, 'test', 'patient', checkIns, healthProfile);
  return userDoc.save();
}

/**
 * Creates Mongoose doc for user
 */
function createUserDoc(name, password, role, checkIns, healthProfile) {
  var userDoc = new userModel({
    name, password, role, checkIns, healthProfile
  });

  return userDoc;
}

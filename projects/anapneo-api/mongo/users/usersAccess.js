const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const logger = require("../../utils/logger");
const jwtUtil = require('../../utils/jwt');
const userModel = createUserModel();

/**
 * Creates Model for user
 */
function createUserModel(){
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
  return mongoose.model('user', userData);
}
exports.getUserModel = function() {
  return userModel;
};

/**
 * Removes all userDocuments from mongo
 */
exports.removeUsers = function() {
  logger.debug('userAccess::removeUsers');
  const userModel = mongoose.model('user');
  return userModel.deleteMany();
};

/**
 * Creates a vendor doc, a model instance given the input schema
 *
 * @param name          - Name of User
 * @param password      - User's password
 * @param role          - Role of user, i.e. patient/advocate/doctor
 * @param checkIns      - List of checkins of the user
 * @param healthProfile - Health Profile of the user
 * @returns {Model}
 */
function createUserDoc(name, password, role, checkIns, healthProfile) {
  return new userModel({ name, password, role, checkIns, healthProfile });
}

/**
 * Returns health profile for a user identified by input token
 */
exports.getHealth = function(token) {
  logger.debug('userAccess::getHealth');
  return findUser(token, 'checkIns')
    .then( function(user) {
      if( user != null ){
        const healthProfile = user['healthProfile'] || {};
        const checkIns      = user['checkIns'] || [];
        const res           = { healthProfile, checkIns: checkIns };

        logger.debug( `Retrieved health data for ${getUserString(user)}: ${JSON.stringify(res)}` );
        return res;
      } else {
        logger.log( `No user found for token ${token}` );
        return { healthProfile: [], checkIns: [] };
      }
    });
};

/**
 * Gets CheckIns of a user identified by input token
 */
exports.getCheckIns = function(token) {
  logger.debug('userAccess::getCheckIns');

  return findUser(token).then( function(user) {
    if( user != null ){
      const checkIns = user['checkIns'] || [];

      logger.debug( `Retrieved user checkIns for ${getUserString(user)} - CheckIns: ${JSON.stringify(checkIns)}` );
      return { checkIns };
    } else {
      logger.log( `No user found for token ${token}` );
      return { checkIns: [] };
    }
  });
};
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
    logger.debug(`UserDoc id: ${userDoc._id} was retrieved from token ${token}`);
    return userDoc._id;
  });
};

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
      let status;
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
exports.findUser = findUser;

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

  const conditions = { name }
         , update  = { $set: { token, loginTS: new Date() }}
         , options = { multi: false };

  function callback (err) {
    if(err) {
      logger.log(err);
    } else {
      logger.log(`Saved login token for user ${name}: ${token}`);
    }
  }

  userModel.updateOne(conditions, update, options, callback);
}

/**
 * Takes name/password provided by user request and verifies it against that stored for the user
 *
 * @param name {string}
 * @param password {string}
 * @returns {Promise} - Object containing status of login
 */
exports.login = function(name, password) {
  logger.debug('userAccess::login');

  const userModel = mongoose.model('user');
  return userModel.findOne({ name }).then(function (userDoc) {
    if( userDoc != null ){
      const storedPassword = userDoc[ 'password' ] || null;
      if( password === storedPassword ){
        let token = userDoc[ 'token' ];
        logger.debug(`Login Success - User: ${name}, Password: ${password}, Old Token: ${token}`);

        // Re-assign token if needed
        if( isLoginExpired(userDoc) || token == null ){
          logger.debug('Token is null or expired - creating a new one...');

          const payload = {
            name: userDoc.name,
            password: userDoc.password
          };
          token = jwtUtil.sign(payload);
          saveUserToken( name, password, token );
        } else {
          logger.debug('Re-using token');
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
};

/**
 * This function determines if a userDoc has a non-expired login time
 */
function isLoginExpired(userDoc) {
  const loginTS = userDoc[ 'loginTS' ] || null;

  const validTimeFrame = 1800000; // 30 minutes - 1000 * 60 * 30
  const expiryTime = new Date(new Date().getTime()-(validTimeFrame));

  // Valid login timestamp that does not exceed the expiry time
  if( loginTS && loginTS > expiryTime ){
    return false;
  }
  return true;
}

/**
 * Logging string helper
 *
 * @param userDoc
 * @returns {string}
 */
function getUserString(userDoc) {
  const name = userDoc['name'] || 'NO_NAME';
  const password = userDoc['password'] || 'NO_PASSWORD';
  const token = userDoc['token'];

  return `Name: ${name}, Password: ${password}, Token: ${token}`;
}

/**
 * Adds Mock Users to mongodb
 */
exports.addMockUser = function(name) {
  // TODO - Add constants
  logger.debug('userAccess::addMockUser');
  const checkIns = [];
  const healthProfile = {
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
  };
  const userDoc = createUserDoc(name, 'test', 'patient', checkIns, healthProfile);
  return userDoc.save();
};

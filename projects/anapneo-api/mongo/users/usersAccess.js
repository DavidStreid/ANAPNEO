var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const path = require("path");
var logger = require("../../utils/logger");

const loggingEnabled = true;

const userModel = getUserModel();

exports.removeUsers = function() {
  logger.log('userAccess::removeUsers')

  const userModel = mongoose.model('user')

  userModel.deleteMany(function (err) {
    if (err) throw err;
  });
  console.error('Removed users from user collection');
}

exports.addUser = function(name, password, type) {
  logger.log('userAccess::addUser');

  // Create & save user
  var userDoc = createUserDoc(name, password, type);
  userDoc.save(function (err) {
     if (err) return handleError(err);
     console.log('saved ' + userDoc.name + ' to users collection');
  });
}

/**
 * Saves a temporary token to the user profile. All requests for sensitive data
 * will require this token
 */
function saveUserToken(name, password, token){
  logger.log('userAccess::saveUserToken');
  // TODO - implement
}

exports.login = function(name, password) {
  logger.log('userAccess::login');

  var userModel = mongoose.model('user');
  return userModel.findOne({ name }).then((result) => {
    if( result.length == 1 ){
      var storedPassword = result[ 'password' ] || null;
      if( password == storedPassword ){
        var token = Math.floor(Math.random()*1000000000000);
        saveUserToken( token );
        return {
                  success: true,
                  status: 'User and password are correct',
                  token }
      }
      return { status: 'User and password do not match', success: false }
    }
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

function getUserModel(){
    // Model of users
    const userData = new Schema({
        name: String,
        password: String,
        role: String,
        token: String       // This token is used to provide access to the application and will be sent with each request
    });
    const userModel = mongoose.model('user', userData);

    return userModel;
}

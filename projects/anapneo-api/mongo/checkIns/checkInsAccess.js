var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const path = require("path");
var logger = require("../../utils/logger");

var vendor = require("../vendor/vendorAccess");
var users = require("../users/usersAccess");

const checkInModel = getCheckInModel();

/**
 * Exposes CheckInModel to api
 */
exports.getCheckInModel = function() {
  return checkInModel;
}

/**
 * Returns Mongoose model for a checkIn
 *
 *       contact: String                  - Name of contact for the checkin
 *       type: String                     - Type of checkIn (E.g. Haircut)
 *       date: Object                     - Date of CheckIn
 *       checkedIn: Boolean               - Whether the checkIn is completed
 *       checkInData: Array               - Data collected from the check-in (Empty for pending checkIns)
 *       user: Schema.Types.ObjectId      - Mongoose reference to user w/ checkIn
 *       advocate: Schema.Types.ObjectId  - Mongoose reference to advocate for checkIn
 */
function getCheckInModel(){
    const checkInData = new Schema({
        _id: Schema.Types.ObjectId,
        contact: String,
        type: String,
        date: Object,
        checkedIn: Boolean,
        checkInData: Array,
        user:     { type: Schema.Types.ObjectId, ref: 'user' },
        advocate: { type: Schema.Types.ObjectId, ref: 'advocate' }
    });
    const checkInModel = mongoose.model('checkIn', checkInData);

    return checkInModel;
}

/**
 * Uses userLoginToken to get a list of checkIns for user for each advocate
 *
 * @token   User token used to uniquely identify user
 * @return  Object[]
 */
exports.getUserCheckIns = function(token) {
  logger.debug('checkInsAccess::getUserCheckIns');
  return users.findUser(token).then( (userDoc) => {
    if( userDoc ) {
      var userId = userDoc._id;
      return checkInModel.find({ user: userId })
                         .populate('advocate')
                         .then( (result) => {
                            logger.log(`Found ${result.length} check-ins for user ${userId}`);

                            // Create mapping of advocate to a list of checkIns that user has for that advocate
                            var advTocheckInsMap = {};
                            result.forEach( (checkIn) => {
                              const advocate = checkIn[ 'advocate' ] || {};

                              // Create appointment object
                              const checkInData = checkIn[ 'checkInData' ] || [];
                              const contact     = checkIn[ 'contact' ] || '';
                              const type        = checkIn[ 'type' ] || '';
                              const date        = checkIn[ 'date' ] || {};
                              const checkedIn   = checkIn[ 'checkedIn' ];
                              const appt        = { checkInData, contact, type, date, checkedIn };

                              // Add entry to mapping
                              if( advocate._id in advTocheckInsMap ) {
                                advTocheckInsMap[ advocate._id ][ 'appointments' ].push(appt);
                              } else {
                                advTocheckInsMap[ advocate._id ] = { advocate, appointments: [ appt ] };
                              }
                            })

                            /* Transform mapping to list of checkins
                             *    checkIns = [ { advocate: {}, appointments: [] }, ...  ]
                             */
                            var checkIns = [];
                            for (var advocateId in advTocheckInsMap) {
                                if (advTocheckInsMap.hasOwnProperty(advocateId)) {
                                  var advocate = advTocheckInsMap[ advocateId ][ 'advocate' ] || {};
                                  var appointments = advTocheckInsMap[ advocateId ][ 'appointments' ] || [];
                                  checkIns.push( { advocate, appointments} )
                                }
                            }
                            return checkIns;
                         });
    } else {
      logger.log('No user found. Returning no checkIns');
      return [];
    }
  })
}

/**
 * Creates Mongoose doc for a checkIn
 */
function createCheckInDoc(contact, type, date, checkedIn, checkInData, user, advocate) {
  var checkInDoc = new checkInModel({
    _id: new mongoose.Types.ObjectId(),
    contact, type, date, checkedIn, checkInData,
    user, advocate
  });
  return checkInDoc;
}

/**
 * Removes all checkins in collection
 */
exports.removeCheckIns = function() {
  logger.debug('checkInsAccess::removeCheckIns');
  return checkInModel.deleteMany();
}

/**
 * Used to create mock checkIns
 */
exports.addMockCheckIns = function(advocateId, userId){
  logger.debug('checkInsAccess::addMockCheckIns');
  var name        = 'Barber';
  var type        = 'Haircut';
  var date        = {  day: 25, month: 2, year: 2019 };
  var checkedIn   = true;
  var checkInData = [ { type: 'Blood Pressure', data: { 'systolic': 120, 'diastolic': 80 } } ];
  var checkInDoc = createCheckInDoc(name, type, date, checkedIn, checkInData, userId, advocateId);
  addCheckIn(checkInDoc);

  name        = 'Barber';
  type        = 'Check-In';
  date        = {  day: 3, month: 3, year: 2019 };
  checkedIn   = false;
  checkInData = [ ];
  checkInDoc = createCheckInDoc(name, type, date, checkedIn, checkInData, userId, advocateId);
  addCheckIn(checkInDoc);
};

/**
 * Updates an existing checkIn w/ checkInData, @checkInUpdate, and sets checkIn to completed
 *
 * @checkInUpdate, { data: {} }         - Data too update the checkIn with
 * @userId, Schema.Types.ObjectId       - Mongoose id for user
 * @advocateId,  Schema.Types.ObjectId  - Mongoose id for advocate
 */
exports.updateCheckIn = function(checkInUpdate, userId, advocateId) {
  logger.debug('checkInsAccess::updateCheckIn');

  var date = checkInUpdate[ 'date' ] || {};
  return checkInModel
                      .findOne( { user: userId, advocate: advocateId, date } )
                      .then( (checkInDoc) => {
                        var status;
                        var isCheckedIn = checkInDoc[ 'checkedIn' ] || false;

                        // Perform validations
                        if( ! checkInDoc ){
                          status = 'Not updating - CheckIn was not found';
                          logger.log(status);
                          return status;
                        }
                        if( isCheckedIn ) {
                          status = 'User has already checked in';
                          logger.log(status);
                          return status;
                        }
                        var data = checkInUpdate[ 'checkInData' ] || [];
                        if( data.length == 0 ){
                          status = 'Not updating - Update contained no data';
                          logger.log(status);
                          return status;
                        }

                        // Update checkInDoc
                        checkInDoc.checkInData = data;
                        checkInDoc.checkedIn = true;
                        return checkInDoc.save().then( (update, err) => {
                          if( err ) {
                            status = 'Update failed';
                            logger.log(status);
                            return status;
                          }
                          status = 'Update success';
                          logger.log(status);
                          return status
                        } );
  })
}

exports.addPendingCheckIn = addPendingCheckIn;
function addPendingCheckIn(checkInObject, userId, advocateId){
  logger.debug('checkInsAccess::addPendingCheckIn');

  // TODO - type checking
  var name        = checkInObject[ 'contact' ] || '';
  var type        = checkInObject[ 'type' ] || '';
  var dateObj = new Date(checkInObject['date']);
  // TODO - save date object instead of this created object
  var date        = { day: dateObj.getDate(), month: dateObj.getMonth() + 1, year: dateObj.getFullYear() };

  var checkedIn   = false;
  var checkInData = [];
  var checkInDoc = createCheckInDoc(name, type, date, checkedIn, checkInData, userId, advocateId);

  return addCheckIn(checkInDoc);
}

/**
 * Adds a new checkIn Mongoose doc to collection
 *
 * @checkInDoc, Mongoose Doc
 */
function addCheckIn(checkInDoc){
  logger.debug('checkInsAccess::addCheckIn');

  // Save checkIn to checkIn collection
  return checkInDoc.save().then(function (update, err) {
    if (err) {
     logger.log(`CheckInUpdate failed: ${err}`);
     return 'CheckIn add failed';
    }

    // Save reference to checkIn in userModel if checkIn has been saved
    logger.log(`Saved checkIn Doc ${checkInDoc._id}. Saving checkIn reference to user...`);
    var userId = checkInDoc.user;
    var userModel = users.getUserModel();
    return userModel.findOne({ _id: userId }).then( (userDoc) => {
      userDoc.checkIns.push(checkInDoc._id);
      return userDoc.save().then(function (doc, err) {
        if (err) {
          logger.log(err);
          return 'Add Check-In failed';
        }
        logger.log(`Saved checkIn ${checkInDoc._id} to checkIns for user ${userDoc._id}`);
        return 'Add Check-In success';
      });
    });
  });
}

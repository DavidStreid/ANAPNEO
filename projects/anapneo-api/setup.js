'use strict';

const routes = require('./api/routes/routes');
const vendor = require('./mongo/advocate/advocateAccess');
const user = require('./mongo/users/usersAccess');
const checkIns = require('./mongo/checkIns/checkInsAccess');
const logger = require('./utils/logger');

module.exports = function(app){
  routes(app);
  populateMongo();
}

/**
 * Deletes contents of toggled models and adds test data
 */
function populateMongo() {
  // Remove documents from collection that are toggled
  var removalMap = {
    advocates:  { remove: true, removalFunc: vendor.removeAdvocates },
    users:      { remove: true, removalFunc: user.removeUsers },
    checkIns:   { remove: true, removalFunc: checkIns.removeCheckIns }
  };
  var removalPromises = [];
  Object.keys(removalMap).forEach(function(collection) {
    var val = removalMap[collection];
    if( val.remove ){
      var promiseFunc = new Promise(function(resolve, reject) {
        val.removalFunc().then( function () {
          var status = `Removed ${collection}`;
          logger.log(status);
          resolve(status);
        })
      });
      removalPromises.push(promiseFunc);
    } else {
      logger.log(`Not removing ${collection}`);
    }
  });

  // Add documents back to test state
  Promise.all(removalPromises)
    .then( function () {
      // Adds mock data after removing all specified collections
      vendor.addMockAdvocates('Fresh Cuts').then( function(advocate){
        user.addMockUser('DavidStreid').then( function (userDoc) {
          checkIns.addMockCheckIns(advocate._id, userDoc._id);
        })
      })
    })
    .catch((err) => logger.debug(err));
}

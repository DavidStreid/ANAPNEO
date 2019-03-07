'use strict';

var routes = require('./api/routes/routes');
var vendor = require('./mongo/vendor/vendorAccess');
var user = require('./mongo/users/usersAccess');
var checkIns = require('./mongo/checkIns/checkInsAccess');
var logger = require('./utils/logger');

module.exports = function(app){
  routes(app);

  // Remove documents from collection
  var removalMap = {
    advocates:  { remove: false, removalFunc: vendor.removeAdvocates },
    users:      { remove: false, removalFunc: user.removeUsers },
    checkIns:   { remove: false, removalFunc: checkIns.removeCheckIns }
  }
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
      vendor.addAdvocates('Fresh Cuts').then( function(advocate){
          user.addMockUser('DavidStreid').then( function (userDoc) {
            checkIns.addMockCheckIns(advocate._id, userDoc._id);
          })
        })
      })
    .catch((err) => logger.debug(err));
}

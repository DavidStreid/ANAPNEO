'use strict';

var routes = require('./api/routes/routes');
var vendor = require('./mongo/vendor/vendorAccess');
var user = require('./mongo/users/usersAccess');

module.exports = function(app){
  // DB Work
  vendor.removeImages();
  vendor.uploadImages();

  user.addMockUser();
  routes(app);
}

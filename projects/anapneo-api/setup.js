'use strict';

var routes = require('./api/routes/routes');
var vendor = require('./mongo/vendor/vendorAccess');
var user = require('./mongo/users/usersAccess');

module.exports = function(app){
  routes(app);

  // DB Work
  vendor.removeImages();
  vendor.uploadImages();

  // Uncomment user methods when userModel changes
  // user.removeUsers();
  vendor.addAdvocates().then( (product) => {
    user.addMockUser();
  });


}

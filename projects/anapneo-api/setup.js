'use strict';

var routes = require('./api/routes/routes');
var vendor = require('./mongo/vendor/vendorAccess');

module.exports = function(app){
  // DB Work
  vendor.removeImages();
  vendor.uploadImages();

  routes(app);
}

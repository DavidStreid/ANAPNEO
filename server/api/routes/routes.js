'use strict';
module.exports = function(app) {
  	var companion = require('../controllers/controller');

	app.route('/helloWorld')
		.get(companion.helloWorld)
	app.route('/textPost')					// Content-Type: Application/json
		.post(companion.textPost)
	app.route('/textPost')					// Handle Pre-flight request
		.options(companion.textPostOptions)
};
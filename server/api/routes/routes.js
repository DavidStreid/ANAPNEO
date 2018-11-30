'use strict';
module.exports = function(app) {
  	var companion = require('../controllers/controller');

    // App Requests
    app.route('/login')
        .post(companion.login);

    app.route('/login')
        .options(companion.textPostOptions);

    app.route('/vendors')
        .get(companion.getVendors);

    app.route('/prescriptions')
        .get(companion.getPrescriptions);

    app.route('/doctors')
        .get(companion.getDoctors);

    // Sample Requests
	app.route('/helloWorld')
		.get(companion.helloWorld);
	app.route('/textPost')					// Content-Type: Application/json
		.post(companion.textPost);
	app.route('/textPost')					// Handle Pre-flight request
		.options(companion.textPostOptions);
};
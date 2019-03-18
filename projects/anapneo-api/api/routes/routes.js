'use strict';

const controller = require('../controllers/controller');
module.exports = function(app) {
    console.log('Registering ANAPNEO Routes...');

    // App Routes
    app.route('/checkIns').get(controller.getCheckIns);
    app.route('/checkIns').options(controller.preFlight);
    app.route('/health').get(controller.getHealth);
    app.route('/health').options(controller.preFlight);
    app.route('/login').post(controller.login);
    app.route('/login').options(controller.preFlight);
    app.route('/submitPending').post(controller.submitPending);
    app.route('/submitPending').options(controller.preFlight);
    app.route('/updateCheckIn').post(controller.updateCheckIn);
    app.route('/updateCheckIn').options(controller.preFlight);
};

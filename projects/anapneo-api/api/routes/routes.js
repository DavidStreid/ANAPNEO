'use strict';

var express = require('express');
var mongoose = require('mongoose');
var vendor = require('../../mongo/advocate/advocateAccess');
var companion = require('../controllers/controller');

module.exports = function(app) {
    console.log('Registering ANAPNEO Routes...');

    app.route('/img')
        .get(companion.getImg);

    // App Requests
    app.route('/login')
        .post(companion.login);
    app.route('/login')
        .options(companion.preFlight);


    app.route('/checkIns')
        .get(companion.getCheckIns);
    app.route('/checkIns')
        .options(companion.preFlight);


    app.route('/updateCheckIn')
        .post(companion.updateCheckIn);
    app.route('/updateCheckIn')
        .options(companion.preFlight);

    app.route('/submitPending')
        .post(companion.submitPending);
    app.route('/submitPending')
        .options(companion.preFlight);

    app.route('/prescriptions')
        .get(companion.getPrescriptions);

    app.route('/health')
        .get(companion.getHealth);
    app.route('/health')
        .options(companion.preFlight);

    // TODO - remove
    app.route('/doctors')
        .get(companion.getDoctors);
};

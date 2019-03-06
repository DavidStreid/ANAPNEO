var db = require('../db/db');
var setup = require('../../projects/anapneo-api/setup'); 	// Performs setup of server
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');	// Parse incoming bodies
var port = process.env.PORT || 4300;

function appSetup() {
  var app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.listen(port, function() {
    app.use(cookieParser());
    console.log(`Anapneo server started on port: ${port}`);
    console.log('Connecting to mongo...');
    connectToMongo().then( () => {
      // Setup Anapneo api after successful db connection
      setup(app);
    });
  });
}
function connectToMongo() {
  return new Promise(function(resolve, reject) {
  // TODO - Configure mongo url w/ conifg
    db.connect('mongodb://localhost:27017/test', function(err) {
      if (err) {
        reject(Error('Unable to connect to Mongo\n' + JSON.stringify(err) ));
      } else {
        resolve('Mongo listening on port 27017...');
      }
    })
  })
}

appSetup();

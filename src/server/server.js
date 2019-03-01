var db = require('../db/db');
var setup = require('../../projects/anapneo-api/setup'); 	//importing route
var express = require('express'),
  app = express(),
  port = process.env.PORT || 4300,
  bodyParser = require('body-parser');	// Parse incoming bodies

function appSetup() {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.listen(port, () => {
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

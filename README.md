# ANAPNEO

## Description
This application provides a platform that incentivizes Medicaid patients at risk of lung cancer to connect to their primary care physician.

## GET PROJECT
$ git clone https://github.com/DavidStreid/ThankYouForStopping.git

## GETTING STARTED
### Running the client
$ cwd=$(pwd)
$ cd $cwd/app 
$ npm install && ng serve

*App should now be started locally. Navigate to http://localhost:4200/

### Running DB
$ cwd=$(pwd)
$ ./db/mongoSetup.sh

### Running the server
$ cwd=$(pwd)
$ cd $cwd/server
$ npm install && npm run devStart

*Server should be started at http://localhost:4300/


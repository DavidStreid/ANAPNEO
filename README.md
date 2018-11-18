# ANAPNEO

## Description
An app-based rewards program to improve lung cancer prognosis.

## GET PROJECT
$ git clone https://github.com/DavidStreid/ThankYouForStopping.git

## GETTING STARTED
* Run each step in a separate session
### 1) Running the client
$ cwd=$(pwd)
$ cd $cwd/app 
$ npm install && ng serve

*App should now be started locally. Navigate to http://localhost:4200/

### 2) Running DB
$ cwd=$(pwd)
$ ./db/mongoSetup.sh

### 3) Running the server
$ cwd=$(pwd)
$ cd $cwd/server
$ npm install && npm run devStart

*Server should be started at http://localhost:4300/

## PROTOTYPE
* We're working on implementing the prototype below for a web interface
### Rewards Portal Sc
![Rewards Portal](/md/RewardPortal.png)

### Feedback Screen
![Feedback](/md/Feedback.png)

### Calendar Screen
![Feedback](/md/Calendar.png)



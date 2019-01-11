# Anapneo Api

## Description
This module runs the anapneo server

## API
TODO

## Login Logic
On login, the user will receive a login token and that token will be saved to their profile as well as a timestamp of the login.
Subsequent requests for user-specific data will be sent w/ the token created at login. This token will be the one used to match 
that user with their data. 

The login timestamp could either be updated on each user-data request, or checked and updated if it falls into a certain window. Or, if the last timestamp is considered "old", determined by exceeding an expiry time ,t, after the timestamp, then the request could be denied and the user could be prompted to log in again in order to refresh their session.
TODO - For now, we'll check if the user session has expired. On expiration, we'll deny the request and the UI will prompt the user to login again.
     

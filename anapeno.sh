mkdir log
cd app
npm install
ng serve 2>&1 > ../log/client.log &
../db/mongoSetup.sh 2>&1 ../log/db.log &
cd ../server
npm install
npm run devStart 2>&1 ../log/server.log &

mkdir log
cd app
npm install
ng serve 2>&1 > ../log/client.log &
../db/mongoSetup.sh > ../log/db.log &
cd ../server
npm install
npm run devStart > ../log/server.log &
cd ../
echo "ANAPNEO is running! Go to 'localhost:4200' in your browser"
printf "PORTS\n\tClient:4200\n\tServer:4300\n\tDB:27017"
echo "Logs are available in ./log"

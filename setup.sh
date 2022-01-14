npm install -g @nestjs/cli

npm install pm2 -g

npm install --silent

cd docker/

docker-compose up --build --no-start --force-recreate

cd ..
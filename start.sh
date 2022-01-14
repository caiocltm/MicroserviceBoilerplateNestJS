cd docker

docker-compose start 

docker exec boilerplate-rabbitmq sh -c 'rabbitmq-plugins enable rabbitmq_management'

cd ..

pm2 start ecosystem.apps.config.js
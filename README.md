# Webjump Microservices Boilerplate

# :fire: Setting Postman Collection + Environment

Import the collection and environment from the directory ```postman``` into Postman.

1. Collection: Webjump_Microservices_Boilerplat_Collection.json
2. Environment: Webjump_Microservices_Boilerplate_Environment.json


# :fire: Setup

> :warning:**WARNING**: Need to install [Docker](https://docs.docker.com/engine/install/ubuntu/) and [Docker Compose](https://docs.docker.com/compose/install/) before execute the command below


This part builds all the containers of the services using **Docker Compose** configuration, install Nestjs CLI dependencies and PM2 to manage all Node.js processes.


```bash
$ sh setup.sh
```

# :fire: Build Microservices

```bash
$ sh build.sh
```


# :fire: Start API Gateway + Microservices


```bash
$ sh start.sh
```


# Run CLI Command - Create API User

> :warning:**WARNING**: To authenticate in the API Gateway, first you need to create a API user using the command below. 


```bash
$ npm run cli:create_api_user
```


# Run CLI Help

```bash
$ npm run cli:help
```


### CLI Help - Create API User

```bash
$ npm run cli:help:create_api_user
```



## Start All Microservices Execution in PM2

```bash
$ pm2 start ecosystem.apps.config.js
```



## Stop All Microservices Execution in PM2

```bash
$ pm2 stop all
```



## Stop Specific Microservice(s) Execution in PM2

```bash
$ pm2 stop [Microservice] | [Process ID]
```



## Watch All Logs in PM2

```bash
$ pm2 logs
```



## Watch Specific Microservice Logs in PM2

```bash
$ pm2 logs [Microservice|Cron]
```



## Run Coverage Tests

```bash
$ npm run test:cov
```



# :fire: Documentation (Swagger)

### [Local Environment](http://localhost:8888/api/docs/)


---


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](LICENSE).
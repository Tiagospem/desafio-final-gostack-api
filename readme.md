# Meetapp API

This is the API used to serve data for the APP mobile and WEB versions, builded with node + express used for certification on bootcamp by Rocketseat.

# Installation

Make sure you already have node and yarn installed, you can read documentations before get started. Then use the package manager for install dependencies.

```bash
$ yarn
```
This API is configured by default to use ``mysql`` database, but you can read Sequelize documentation to install any other sql database.



## Redis

Please install Redis on your machine to run jobs on the backend.
If you have docker installed please create a container with:

```sh
$ docker run --name redismeetup -p 6379:6379 -d -t redis:alpine
```


## Environment Variables


You need to configure some environment variables before run server, please follows the steps below:

```sh
$ cp .env.example .env
```

Open .env file and edit the environment variables

```APP_URL=http://localhost:3333

NODE_ENV=development

APP_SECRET=

DB_DIALECT=mysql
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_SECURE=false
MAIL_USER=
MAIL_PASS=

SENTRY_DSN=
```

## Run Migrations

```sh
$ yarn sequelize db:migrate
```

## Seeds
This API comes with some fake data to demo purposes

```sh
$ yarn sequelize db:seed:all
```

## Run server

```sh
$ yarn dev
$ yarn queue
```
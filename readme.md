# Meetap App backend

please follow the steps below to run backend

```sh
$ yarn
$ yarn add mysql2
$ cp .env.example .env
```

then open .env and edit the environment variables

# Note

you can run with any SQL database, just read sequelize docs.

# Redis

please install redis on your machine to run jobs on the backend.
if you have docker installed please create a container with

```sh
$ docker run --name redismeetup -p 6379:6379 -d -t redis:alpine
```

# Run server

```sh
$ yarn dev
$ yarn queue
```
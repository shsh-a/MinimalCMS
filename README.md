## Description

A nestjs boilerplate I made for myself. It has JWT auth and RBAC using policy for each action.

## Installation

```bash
$ npm install
```

## DB commands

DB was designed first using MySQL workbench for this

```bash
# pull db changes
$ npx prisma db pull
# update schema
$ npx prisma db generate
```

## First time to seed db with admin user

```bash
$ npx prisma db seed
```

## Running the app

```bash

# dev
$ npm run start:dev


```

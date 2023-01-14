# Storefront Backend Project

## Getting Started

To get started, clone this repo and run `yarn` or `npm i` in your terminal at the project root.

These are the environment variables used in .env file

NODE_ENV=dev

POSTGRES_HOST=127.0.0.1

POSTGRES_PORT=5432

POSTGRES_DB=store_dev

POSTGRES_TEST_DB=store_test

POSTGRES_USER=postgres

POSTGRES_PASSWORD=admin

BCRYPT_PASSWORD = mysecretpass

SALT_ROUNDS = 10

TOKEN_SECRET = mysecrettoken

You should create two databases with values in POSTGRES_DB and POSTGRES_TEST_DB

- Database setup example using SQL
- Create user `CREATE USER full_stack_user WITH PASSWORD 'Pass123';`
- Create database `CREATE DATABASE store_dev; CREATE DATABASE store_test;`
- Grant privileges to user `GRANT ALL PRIVILEGES ON DATABASE store_dev TO full_stack_user; GRANT ALL PRIVILEGES ON DATABASE store_test TO full_stack_user;`

## Required Technologies

These are the required technologies for the project:

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Overview

### 1. DB Creation and Migrations

- To start running everything in test environment without doing any manual step please run `test`
- If you wish to run migrations in test environment you can run `migratetestdb` to migrate down for test environment you can run `cleartestdb`
- If you wish to run migrations in dev environment you can run `migrate-up` and for down migrations run `migrate-down`

### 2. API Endpoints

- Please check REQUIREMENTS.md for all API endpoints

## Steps to Completion

### - [:heavy_check_mark:] 1. Plan to Meet Requirements

### - [:heavy_check_mark:] 2. DB Creation and Migrations

### - [:heavy_check_mark:] 3. Models

### - [:heavy_check_mark:] 4. Express Handlers

### - [:heavy_check_mark:] 5. JWTs

### - [:heavy_check_mark:] 6. QA and `README.md`

## bond-task
An app for displaying and favoriting nba players.


### Dependencies:
- Node.js
- PostgreSQL

##Setup

### Install Node.js and PostgreSQL
Ensure you have Node.js and PostgreSQL installed on your machine. You can download them from the following links:
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Install Project dependencies
1. cd `bond-task/simple-server`
2. `npm install`

### Create and seed the database
 1. Run `psql` to access Postgres command line
 2. Run `CREATE ROLE dev_user;` to create new superuser
 3. Run `CREATE DATABASE nba_players OWNER dev_user;` 
 4. Run `GRANT ALL PRIVILEGES ON DATABASE nba_players TO dev_user;`
 5. cd `/bond-task/simple-server`
 6. Run `npm run create-tables` to create the database tables
 7. Run `npm run seed` to seed the test database
 8. Confirm data is correctly seeded by connect to the database `psql -U dev_user -d nba_players` and querying `SELECT * FROM favorite_players;`

 ### Create a .env file
  1. Create a .env file in simple-server. (You can run `touch .env`)
  
  Sample Database Connection
  ```
    DB_USER=dev_user
    DB_HOST=localhost
    DB_NAME=nba_players
    DB_PASSWORD=<password>
    DB_PORT=5432
  ```

  In order to access the API data, you must obtain and set the ACCESS_TOKEN.

 ## Start the server
 1. cd `/bond-task/simple-server`
 2. Run `npm start`

 ## Start the app
 1. cd bond-task/bond-ball
 2. Run `npm-start`

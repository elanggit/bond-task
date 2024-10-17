## bond-task
An app for displaying and favoriting NBA players. 

Note: This app does not currently have authentication and is just a demo. Therefore, all of the data is for a mock user (1). 

Link to schema designs: https://excalidraw.com/#json=u1N1enNwUttdgWLQW611i,TsRZuaswJ12YAGYUFflt0w



### Dependencies:
- Node.js
- PostgreSQL

## Setup

### Install Node.js and PostgreSQL
Ensure you have Node.js and PostgreSQL installed on your machine. You can download them from the following links:
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Install Project dependencies
1. `cd bond-task/simple-server` for server dependencies
2. Run `npm install`
3. cd bond-task/bond-ball for client dependencies
4. Run `npm install`


 ### Create a .env file
  1. Create a .env file in simple-server. (You can run `touch .env` from the root directory of simple-server)
  
  Sample Database Connection
  ```
    DB_USER=dev_user
    DB_HOST=localhost
    DB_NAME=nba_players
    DB_PASSWORD=<password>
    DB_PORT=5432
  ```

  In order to access the API data, you must obtain and set the ACCESS_TOKEN in .env. You can obtain it at https://new.balldontlie.io/

  ### Create and seed the database
 1. Run `psql` to access Postgres command line (Ensure postgres is installed and running)
 2. Run `CREATE ROLE dev_user;` to create new superuser
 3. Run `CREATE DATABASE nba_players OWNER dev_user;` 
 4. Run `GRANT ALL PRIVILEGES ON DATABASE nba_players TO dev_user;`
 5. cd `/bond-task/simple-server`
 6. Run `npm run create-tables` to create the database tables
 7. Run `npm run seed` to seed the test database
 8. Confirm data is correctly seeded by connect to the database `psql -U dev_user -d nba_players` and querying `SELECT * FROM favorite_players;`

 ## Start the server
 1. cd `/bond-task/simple-server`
 2. Run `npm start`

 ## Start the app
 1. cd bond-task/bond-ball
 2. Run `npm-start`

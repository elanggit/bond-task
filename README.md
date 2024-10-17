# bond-task


Dependencies:
- Node 
- Postgres

Setup

## Create and seed the database
 1. Run `psql` to access Postgres command line
 2. Run `CREATE ROLE dev_user;` to create new superuser
 3. Run `CREATE DATABASE nba_players OWNER dev_user;` 
 4. Run `GRANT ALL PRIVILEGES ON DATABASE nba_players TO dev_user;`
 5. cd /bond-task/simple-server
 6. Run `npm run create-tables` to create the database tables
 7. Run `npm run seed` to seed the test database
 8. Confirm data is correctly seeded by connect to the database `psql -U dev_user -d nba_players` and querying `SELECT * FROM favorite_players;`
 

 ## Start the server
 1. cd /bond-task/simple-server
 2. Run `npm start`

 Start the app
 1. cd bond-task/bond-ball
 2. Run `npm-start`

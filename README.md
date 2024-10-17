# bond-task


Dependencies:
- Node 
- Postgres

Setup

## Create the database
 1. Run `psql` to access Postgres command line
 2. Run `CREATE ROLE dev_user;` to create new superuser
 3. Run `CREATE DATABASE nba_players OWNER dev_user;` 
 4. Run `GRANT ALL PRIVILEGES ON DATABASE nba_players TO dev_user;`
 5. cd /bond-task/simple-server/db

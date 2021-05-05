const { Client } = require('pg');

/*
It's not best practice to commit your db credentials to your git repo.
This is why put those in this separate file so you can easily add this file into a .gitignore 
file. There is also the possibility of connecting throught environment variables but for 
simplicity's sake I've decided to put the credentials in code.

Note that the credentials below uses the default postgres user
which is not recommended in production.
*/
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'comicrepo',
    password: 'postgres',
    port: 5432,
});


module.exports = {
    client
}
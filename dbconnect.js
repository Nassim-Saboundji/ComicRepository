const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'comicrepo',
    password: 'postgres',
    port: 5432,
});

client.connect();

const query = `insert into author(firstname,lastname) values ('Amine', 'Saboundji')`;

client.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Data insert successful');
});

const query2 = `SELECT * FROM author`;
client.query(query2, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    for (let row of res.rows) {
        console.log(row);
    }
    client.end();
});
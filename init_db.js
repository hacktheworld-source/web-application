const sqlite3 = require('sqlite3').verbose();

//Connect to the SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to the SQLite database');
    }
});

//Create a table for greetings
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS greetings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        message TEXT
        )`);
});

//Close the database connection
db.close((err) => {
    if (err) {
        console.error('Could not close database connection', err);
    } else {
        console.log('Closed the database connection');
    }
});
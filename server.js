const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();

//Connect to the SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to the SQLite database');
    }
});

//Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

//Define a route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Define an API endpoint that returns a greeting message
app.get('/api/greet/:name', (req, res) => {
    const name = req.params.name;
    const message = `Hello, ${name}!`;

    //Insert the greeting into the database
    db.run('INSERT INTO greetings (name, message) VALUES (?, ?)', [name, message], (err) => {
        if (err) {
            return console.error('Could not insert greeting', err);
        }
        console.log('Greeting inserted into database');
        //You can view the database by running this in the console:
        // > sqlite3 database.sqlite
        // > SELECT * FROM greetings;
    });

    res.json({ message: message });

});

//Define an API endpoint that retrieves all greetings
app.get('/api/greetings', (req, res) => {
    db.all('SELECT * FROM greetings', [], (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ greetings: rows });
    });
});

// //Define an API endpoint that returns a greeting message
// app.get('/api/greet/:name', (req, res) => {
//     const name = req.params.name;
//     res.json({ message: `Hello, ${name}!` });
// });

//Start the server on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
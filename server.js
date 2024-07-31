const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser'); // Body parsing middleware
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000; //Start the server on port 3000

//Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure body parser to handle JSON requests
app.use(bodyParser.json());

// Configure sessions
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS
}));

//Path to the database file
const dbPath = path.resolve(__dirname, 'database.sqlite');

//Connect to the SQLite database, initializes it if it doesn't exist
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to the SQLite database');
        db.run(`CREATE TABLE IF NOT EXISTS greetings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            message TEXT NOT NULL
            )`, (err) => {
                if (err) {
                    console.error('Could not create table', err);
                }
            });
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
            )`, (err) => {
                if (err) {
                    console.error('Could not create users table', err);
                }
            });
    }
});

function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'You must be logged in to access this resource'});
    }
    next();
}

// Route for user registration
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
            if (err) {
                return  res.status(500).json({ error: err.message });
            }
            console.log('User registered into database');
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

// Route for user login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result) {
                req.session.userId = user.id;
                console.log('User: ' + username + ' logged in successfully');
                res.status(200).json({ message: 'Logged in successfully' });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    });
});

// Route for user logout
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});


//Define a route for the homepage
app.get('/', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Define an API endpoint that returns a greeting message
app.get('/api/greet/:name', requireLogin, (req, res) => {
    const name = req.params.name;
    const message = `Hello, ${name}!`;

    //Insert the greeting into the database
    db.run('INSERT INTO greetings (name, message) VALUES (?, ?)', [name, message], (err) => {
        if (err) {
            return console.error('Could not insert greeting', err);
            //return res.status(500).json({ error: err.message });
        }
        console.log('Greeting inserted into database');
        //You can view the database by running this in the console:
        // > sqlite3 database.sqlite
        // > SELECT * FROM greetings;
    });

    res.json({ message: message });

});

//Define an API endpoint that retrieves all greetings
app.get('/api/greetings', requireLogin, (req, res) => {
    db.all('SELECT name, message FROM greetings', [], (err, rows) => {
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
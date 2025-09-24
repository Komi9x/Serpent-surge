// Don't forget to specify the credentials at the 'db' constant part!

const express = require('express');
const mysql = require('mysql2');
const port = 3000;
const cors = require('cors');
const app = express();

app.use(cors());

// Database credentials - make sure you don't store sensitive information here in plain text!
const db = mysql.createConnection({
    host: 'MYSQL_HOST',
    user: 'MYSQL_USER',
    password: 'MYSQL_PASSWORD',
    database: 'MYSQL_DATABASE',
    port: '3306',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL');
});

app.use(express.json());

// Endpoint for saving scores with a POST request
app.post('/save-score', (req, res) => {
    const { name, difficulty, score } = req.body;

    if (name.length !== 3 || difficulty < 1 || difficulty > 3) {
        return res.status(400).json({ message: "Invalid input" });
    }

    const calculatedScore = difficulty * score;

    db.query(`INSERT INTO scores (name, difficulty, score) VALUES (?, ?, ?)`,
        [name, difficulty, calculatedScore],
        (err) => {
            if (err) {
                return res.status(500).json({ message: "Error saving score" });
            }
            res.status(200).json({ message: "Score saved successfully!" });
        });
});

// Endpoint for getting the top 10 scores from the DB with a GET request
app.get('/top-scores', (req, res) => {
    db.query(`SELECT name, difficulty, score FROM scores ORDER BY score DESC LIMIT 10`, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error retrieving scores" });
        }
        res.status(200).json(results);
    });
});

app.listen(port,'0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
});

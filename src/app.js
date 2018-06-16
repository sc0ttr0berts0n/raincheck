require('dotenv').load();

// Init Express
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// Pull in Raincheck
const Raincheck = require('./raincheck');
const raincheck = new Raincheck();

app.listen(port, function() {
    console.log('Server is running on ' + port + ' port');
});

app.get('/', function(req, res) {
    res.send('da root – sandstorm');
});

app.get('/raincheck', function(req, res) {
    if (
        req.query.key === process.env.SECRET_KEY &&
        req.query.key !== undefined
    ) {
        raincheck.getWeatherCategory().then(weather => res.send(weather));
    } else {
        res.send('Bad Key');
    }
});

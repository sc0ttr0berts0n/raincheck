require('dotenv').load();

// Init Express
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// Pull in Raincheck
const Raincheck = require('./raincheck');
const raincheck = new Raincheck();

let nextHourForecast;
let raincheckInterval;

app.listen(port, function() {
    console.log('Server is running on ' + port + ' port');
});

app.get('/', function(req, res) {
    res.send('da root – sandstorm');
});

app.get('/raincheck', function(req, res) {
    if (keyIsValid(req)) {
        raincheck.getWeatherCategory().then(weather => res.send(weather));
    } else {
        res.send('Bad Key');
    }
});

app.get('/minutely', function(req, res) {
    if (keyIsValid(req)) {
        raincheck.getMinutelyForecast().then(weather => res.send(weather));
    } else {
        res.send('Bad Key');
    }
});

app.get('/hourly', function(req, res) {
    if (keyIsValid(req)) {
        raincheck.getHourlyForecast().then(weather => res.send(weather));
    } else {
        res.send('Bad Key');
    }
});

app.get('/super', function(req, res) {
    if (keyIsValid(req)) {
        raincheck.getSuperData().then(weather => res.send(weather));
    } else {
        res.send('Bad Key');
    }
});

app.get('/servo', function(req, res) {
    if (keyIsValid(req)) {
        res.send(nextHourForecast);
    } else {
        res.send('Bad Key');
    }
});

function keyIsValid(req) {
    return (
        req.query.key === process.env.SECRET_KEY && req.query.key !== undefined
    );
}

// send first forecast api call
raincheck.getHourlyForecast().then(weather => (nextHourForecast = weather));

// ping every ten minutes for the hourly forecast
raincheckInterval = setInterval(() => {
    raincheck.getHourlyForecast().then(weather => (nextHourForecast = weather));
}, 1000 * 60 * 10);

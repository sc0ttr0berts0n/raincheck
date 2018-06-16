require('dotenv').load();

// Init Dark Sky
const DarkSky = require('dark-sky');
const darksky = new DarkSky(process.env.DARK_SKY); // Your API KEY can be hardcoded, but I recommend setting it as an env variable.

class Raincheck {
    constructor() {
        this.weatherMap = [
            {
                name: 'clear',
                conditions: ['clear-day', 'clear-night', 'wind']
            },
            {
                name: 'cloudy',
                conditions: [
                    'fog',
                    'cloudy',
                    'partly-cloudy-day',
                    'partly-cloudy-night'
                ]
            },
            {
                name: 'rainy',
                conditions: ['rain', 'snow', 'sleet', 'hail']
            }
        ];
    }
    getWeatherCategory() {
        return this.getWeatherIcon().then(
            data =>
                this.weatherMap.find(cat =>
                    cat.conditions.includes('clear-day')
                ).name
        );
    }

    getWeatherIcon() {
        return darksky
            .options({
                latitude: process.env.LAT,
                longitude: process.env.LON,
                language: 'en',
                exclude: ['currently', 'minutely', 'daily', 'alerts', 'flags']
            })
            .get()
            .then(function(data) {
                return data.hourly.icon;
            });
    }
}

module.exports = Raincheck;

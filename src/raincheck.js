require('dotenv').load();

// Set up fs read/write
const fs = require('fs');

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
        return this.getWeatherIcon()
            .then(weather => {
                const weatherCategory = this.weatherMap.find(category =>
                    category.conditions.includes(weather)
                ).name;
                this.writeDataWithTimestamp(
                    'weather-category',
                    weatherCategory
                );
                return weatherCategory;
            })
            .catch(weather => {
                console.log(weather);
                return 'Internal Error: ' + weather;
            });
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
            .then(data => data.hourly.icon);
    }

    getMinutelyForecast() {
        return darksky
            .options({
                latitude: process.env.LAT,
                longitude: process.env.LON,
                language: 'en',
                exclude: ['currently', 'hourly', 'daily', 'alerts', 'flags']
            })
            .get()
            .then(weather => weather.minutely.data)
            .catch(data => {
                console.log(weather.minutely.data);
                return 'Internal Error: ' + weather.minutely.data;
            });
    }
    getHourlyForecast() {
        return darksky
            .options({
                latitude: process.env.LAT,
                longitude: process.env.LON,
                language: 'en',
                exclude: ['currently', 'minutely', 'daily', 'alerts', 'flags']
            })
            .get()
            .then(weather => weather.hourly.data[0])
            .catch(data => {
                console.log(weather.hourly.data);
                return 'Internal Error: ' + weather.hourly.data;
            });
    }
    getSuperData() {
        return darksky
            .options({
                latitude: process.env.LAT,
                longitude: process.env.LON,
                language: 'en'
            })
            .get()
            .then(weather => weather)
            .catch(data => {
                console.log(weather);
                return 'Internal Error: ' + weather;
            });
    }
    writeDataWithTimestamp(name, data) {
        let json = { time: Date.now(), data: data };
        let path = './cache-' + name + '.json';
        fs.writeFile(path, JSON.stringify(json), 'utf8', () =>
            console.log(path + ' generated')
        );
    }
}

module.exports = Raincheck;

const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser middleware to handle form data
app.use(bodyParser.urlencoded({ extended: false }));

// Home route
app.get('/', (req, res) => {
    res.render('index', { weather: null, forecast: null, error: null });
});

app.post('/', async (req, res) => {
    const location = req.body.location;
    const apiKey = '44735e4ef5369a064575a086baed671f'; // replace with your OpenWeatherMap API key

    try {
        // Fetch current weather
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
        const weatherData = weatherResponse.data;

        // Fetch hourly forecast
        const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`);
        const forecastData = forecastResponse.data;

        // Get the current date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Filter forecast for the current day
        const todayForecast = forecastData.list.filter(item => item.dt_txt.startsWith(today));

        res.render('index', {
            weather: weatherData,
            forecast: todayForecast,
            error: null
        });
    } catch (error) {
        console.error(error);
        res.render('index', { weather: null, forecast: null, error: 'Unable to fetch weather data. Please check the location and try again.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

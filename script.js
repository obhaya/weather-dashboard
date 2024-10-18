// Define API keys
//const openWeatherApiKey = 'ab58c55e3e18cefc9246ca6efce2c538';
//const geminiApiKey = 'AIzaSyADU2wt0C_pVm87M1ml1vRDAui-A5uM8-Q'; // Keep this secure

// Define API keys
const openWeatherApiKey = 'ab58c55e3e18cefc9246ca6efce2c538'; // Replace with your actual API key

// Function to detect if the query is weather-related
function isWeatherQuery(query) {
    return query.toLowerCase().includes("weather");
}

// Function to handle weather queries
// Function to handle weather queries
// Function to handle weather queries
// Function to handle weather queries

// Function to get weather data
async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Construct a detailed weather message
        const weatherDetails = `
            <h3>Weather Details for ${data.name}</h3>
            <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
            <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
            <p><strong>Condition:</strong> ${data.weather[0].description}</p>
        `;

        // Calculate condition percentages based on the weather condition
        let sunnyPercentage = 0;
        let cloudyPercentage = 0;
        let rainyPercentage = 0;

        if (data.weather[0].main === 'Clear') {
            sunnyPercentage = 100;
        } else if (data.weather[0].main === 'Clouds') {
            cloudyPercentage = 100;
        } else if (data.weather[0].main === 'Rain') {
            rainyPercentage = 100;
        } else {
            // If the weather condition is not sunny, cloudy, or rainy, distribute percentages accordingly
            sunnyPercentage = 30; // Assign some default values for other weather conditions
            cloudyPercentage = 30;
            rainyPercentage = 40;
        }

        const conditionPercentages = [sunnyPercentage, cloudyPercentage, rainyPercentage];

        // Return both weather details and the data needed for charts
        return {
            details: weatherDetails,
            temp: data.main.temp,
            humidity: data.main.humidity,
            condition: data.weather[0].description,
            conditionPercentages: conditionPercentages // Pass the calculated percentages
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return {
            details: 'Sorry, I could not retrieve the weather information at the moment.',
            temp: null,
            humidity: null,
            condition: null,
            conditionPercentages: [0, 0, 0] // Default values for error case
        };
    }
}


// Main function to handle user queries
// Main function to handle user queries
// Function to set up the charts with the actual weather data
// Function to set up the charts with the actual weather data
// Function to set up the charts with the actual weather data
function setupCharts(temperature, humidity, conditionPercentages) {
    const ctxBar = document.getElementById('barChart').getContext('2d');
    const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');
    const ctxLine = document.getElementById('lineChart').getContext('2d');

    // Generate some variations for temperature and humidity over the next 5 days
    const temperatureData = [
        temperature, 
        temperature + Math.random() * 4 - 2, // random variation
        temperature + Math.random() * 4 - 2,
        temperature + Math.random() * 4 - 2,
        temperature + Math.random() * 4 - 2
    ];
    
    const humidityData = [
        humidity, 
        humidity + Math.random() * 10 - 5, // random variation
        humidity + Math.random() * 10 - 5,
        humidity + Math.random() * 10 - 5,
        humidity + Math.random() * 10 - 5
    ];

    // Create the bar chart with dynamic temperature data
    const barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatureData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Create the doughnut chart with the updated condition percentages
    const doughnutChart = new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: {
            labels: ['Sunny', 'Cloudy', 'Rainy'], // Example weather conditions
            datasets: [{
                label: 'Weather Conditions',
                data: conditionPercentages,
                backgroundColor: [
                    'rgba(255, 206, 86, 0.6)', // Sunny
                    'rgba(54, 162, 235, 0.6)', // Cloudy
                    'rgba(255, 99, 132, 0.6)', // Rainy
                ],
            }]
        },
        options: {
            responsive: true,
        }
    });

    // Create the line chart with dynamic humidity data
    const lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
            datasets: [{
                label: 'Humidity (%)',
                data: humidityData,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


// Main function to handle user queries
// Main function to handle user queries
async function handleQuery() {
    const userQuery = document.getElementById('userQuery').value;
    const city = userQuery.trim(); // Get the entered city name

    if (city) {
        const weatherData = await getWeather(city);
        document.getElementById('weatherDetails').innerHTML = weatherData.details; // Update weather details

        // Set up the charts using the fetched data
        setupCharts(weatherData.temp, weatherData.humidity, weatherData.conditionPercentages); // Pass temperature, humidity, and condition percentages
    } else {
        document.getElementById('weatherDetails').innerHTML = 'Please enter a city name.';
    }
}



// Add event listener to the button
document.getElementById('askBtn').addEventListener('click', handleQuery);


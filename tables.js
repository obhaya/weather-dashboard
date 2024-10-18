//const openWeatherApiKey = 'ab58c55e3e18cefc9246ca6efce2c538'; // Replace with your actual API key

// Define your OpenWeather API key
const openWeatherApiKey = 'ab58c55e3e18cefc9246ca6efce2c538'; // Replace with your actual API key
//AIzaSyDaSOQkxpwupUQJ-dlY44igSWxaKPoXsgo






// OpenWeather API Key
//const openWeatherApiKey = 'YOUR_OPEN_WEATHER_API_KEY'; // Replace with your actual API key

// Gemini API Key
const geminiApiKey = 'AIzaSyDaSOQkxpwupUQJ-dlY44igSWxaKPoXsgo'; // Replace with your actual Gemini API key

// Function to fetch the 5-day weather forecast for a given city
async function fetchWeatherForecast(city) {
    const apiKey = 'ab58c55e3e18cefc9246ca6efce2c538';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== '200') {
            return [];
        }

        const forecastData = [];
        const uniqueDates = new Set();

        // Process each forecast entry
        data.list.forEach(entry => {
            const dateTime = new Date(entry.dt * 1000); // Convert Unix timestamp to JavaScript Date
            const dateString = dateTime.toISOString().split('T')[0]; // Extract the date part (YYYY-MM-DD)

            // Only add unique dates to avoid duplicates
            if (!uniqueDates.has(dateString)) {
                uniqueDates.add(dateString);
                forecastData.push({
                    date: dateString,
                    temp: entry.main.temp.toFixed(2),
                    humidity: entry.main.humidity,
                    condition: entry.weather[0].description
                });
            }
        });

        return forecastData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return [];
    }
}



// Function to handle non-weather-related queries using Gemini API
async function getGeminiResponse(query) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: query // The user's input question
                        }
                    ]
                }
            ]
        })
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Gemini API response:', data); // Log the API response
        return data.contents[0].parts[0].text; // Adjust based on the actual response structure
    } catch (error) {
        console.error('Error fetching Gemini chatbot response:', error);
        return 'Sorry, I could not understand your question.';
    }
}


// Function to handle chatbot queries
// Function to handle chatbot queries
// Variable to track if the chatbot is waiting for a city name
// Variable to track if the chatbot is waiting for a city name
let awaitingCityName = false;
let cityInputElement = null;

// Function to handle chatbot queries
document.getElementById('askChatbot').addEventListener('click', async () => {
    const query = document.getElementById('chatbotInput').value.trim().toLowerCase();
    let responseText = '';

    // Keywords to identify weather-related queries
    const weatherKeywords = ['weather', 'temperature', 'forecast', 'humidity', 'climate'];

    // Check if the chatbot is waiting for a city name
    if (awaitingCityName && cityInputElement) {
        // Get the city name from the new input field
        const city = cityInputElement.value.trim();

        if (city) {
            const forecastData = await fetchWeatherForecast(city);

            if (forecastData.length === 0) {
                responseText = `Could not fetch weather details for ${city}. Please try again.`;
            } else {
                // Display weather forecast for the city
                responseText = `The weather forecast for ${city} is as follows:\n`;
                forecastData.forEach(entry => {
                    responseText += `${entry.date}: ${entry.temp} °C, Humidity: ${entry.humidity}%, Condition: ${entry.condition}\n`;
                });

                // Save the forecast data for future reference
                window.forecastData = forecastData;
            }

            // Reset the state and remove the new input field
            awaitingCityName = false;
            cityInputElement.parentElement.removeChild(cityInputElement);
            cityInputElement = null;

        } else {
            responseText = 'Please enter a valid city name.';
        }

    } else {
        // Detect if the query is weather-related
        const isWeatherRelated = weatherKeywords.some(keyword => query.includes(keyword));

        if (isWeatherRelated) {
            // Ask the user to provide the city name
            responseText = 'Please enter the name of the city to get the weather details.';
            awaitingCityName = true; // Set the flag to true to wait for the city name

            // Create a new input field for the city
            createCityInputField();
        } else {
            // Use Gemini API for non-weather-related queries
            responseText = 'Irrelevant question. Please ask a weather-related question.';
        }
    }

    // Display the response in the chatbot
    document.getElementById('chatbotResponse').innerText = responseText;
});

// Function to create a new input field for city name
function createCityInputField() {
    const chatbotContainer = document.querySelector('.chatbot-container');

    // Create the new input element
    cityInputElement = document.createElement('input');
    cityInputElement.type = 'text';
    cityInputElement.placeholder = 'Enter city name...';
    cityInputElement.id = 'cityInputDynamic';
    cityInputElement.style.marginTop = '10px';
    cityInputElement.style.display = 'block';
    cityInputElement.style.width = '70%';

    // Append the new input element to the chatbot container
    chatbotContainer.appendChild(cityInputElement);
}

// Event listener for getting the weather forecast manually
document.getElementById('getWeatherButton').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        const forecastData = await fetchWeatherForecast(city);
        renderTable(forecastData);
        window.forecastData = forecastData;
    } else {
        alert('Please enter a city name.');
    }
});



// Event listener for getting the weather forecast
document.getElementById('getWeatherButton').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        const forecastData = await fetchWeatherForecast(city);
        renderTable(forecastData);
        window.forecastData = forecastData;
    } else {
        alert('Please enter a city name.');
    }
});

// Function to render the forecast table
function renderTable(forecastData) {
    const tableBody = document.getElementById('forecastTable').querySelector('tbody');
    tableBody.innerHTML = '';
    if (forecastData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3">No data available</td></tr>';
        return;
    }
    forecastData.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.temp} °C</td>
            <td>${entry.humidity} %</td>
        `;
        tableBody.appendChild(row);
    });
}


let form = document.getElementById("weatherForm");
let cityInput = document.getElementById("cityInput");
let result = document.getElementById("result");
let link = document.getElementById("link");


function suggestFarming(temp, humidity, weatherMain) {

    weatherMain = weatherMain.toLowerCase();

    if (weatherMain.includes("rain")) {
        return "Rice and Sugarcane farming";
    }

    if (temp > 32 && humidity < 50) {
        return "Millets and Groundnut farming";
    }

    if (temp >= 20 && temp <= 32) {
        return "Rice, Maize and Vegetable farming";
    }

    if (temp < 20) {
        return "Wheat and Barley farming";
    }

    return "Mixed farming";
}

function changeBackground(temp) {

    if (temp >= 32) {
        document.body.style.background = "linear-gradient(to right, #ff9966, #ff5e62)";
    } else if (temp >= 20) {
        document.body.style.background = "linear-gradient(to right, #56ab2f, #a8e063)";
    } else {
        document.body.style.background = "linear-gradient(to right, #2193b0, #6dd5ed)";
    }
}

function displayWeather(data) {

    let city = data.name;
    let icon = data.weather[0].icon;
    let temp = data.main.temp;
    let weatherDesc = data.weather[0].description;
    let humidity = data.main.humidity;

    let weatherMain = data.weather[0].main;


    let suggestion = suggestFarming(temp, humidity, weatherMain);

    changeBackground(temp);

    const googleSearchLink =
        `https://www.google.com/search?q=${suggestion.replaceAll(" ", "+")} in ${city}`;
    // https://www.google.com/search?q=

    result.innerHTML = `
        <h4>${city}</h4>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" 
             class="weather-icon">
        <p><strong>${temp} °C</strong></p>
        <p>${weatherDesc}</p>
        <p>Humidity: ${humidity}%</p>

        <div class="suggestion-box">
            🌾 Best Suitable: <strong>${suggestion}</strong>
        </div>

        <a href="${googleSearchLink}" 
           target="_blank" 
           class="btn btn-primary btn-block">
           Learn More
        </a>
    `;
}

async function getWeather(city) {

    result.innerHTML = "<p class='loading'>Loading...</p>";

    try {
        const apiKey = "b9cb47e4a4a36e76bfa617e2806a9d1a";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        result.innerHTML = `<p class="text-danger">${error.message}</p>`;
    }
}


form.addEventListener("submit", function(e) {
    e.preventDefault();
    let city = cityInput.value.trim();

    if (!city) {
        result.innerHTML = "<p class='text-danger'>Enter city name</p>";
        return;
    }

    getWeather(city);
});
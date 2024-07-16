const apiKey = "filler";
const paid_key = "filler";
const units = "imperial";

// Main Function - Jimin
document.querySelector('.search-box button').addEventListener("click", () => {
    const cityName = document.getElementById("search-inputbox").value;
    
    const zipcode = document.getElementById("zipcode").value;

    // Geocoding Api Call
    const geocodeApi = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&appid=${apiKey}`;
    fetch(geocodeApi)
        .then(response => response.json())
        .then(data => {
            document.querySelector('.invalid-search').style.display = 'none';

            const city = data[0];
            // This displays the city name (Line 16) and calls the two functions to update weather image and weather details (Uses line 13. Json response data is an array)
            document.querySelector('.city-name').innerText = city.name;
            updateWeatherImage(city.lat, city.lon);
            updateWeatherDetails(city.lat, city.lon);
            hourlyAndDaily(city.lat, city.lon);

        })
        .catch(error => {
            console.error('Fetching Geocoding Api Error:', error);
            alert('Error fetching geocoding data. TRY AGAIN!');
            console.log(error);
            document.querySelector('.invalid-search').style.display = 'block';
        });
        
});
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Helper This function updates the weather image by calling & fetching the api, display image and catches errors - Jimin
function updateWeatherImage(lat, lon) {
    const currentweatherdataApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    fetch(currentweatherdataApi)
        .then(response => response.json())
        .then(weatherData => {
            
            console.log('Weather Data:', weatherData); // console weather data

            const weatherImage = getWeatherImage(weatherData.weather[0].description);

            document.querySelector('.current-weatherimg h2').innerText = 'Current Weather';

            document.querySelector('.current-weatherimg img').src = weatherImage;
        })
        .catch(error => {
            console.error('Fetching Current-Weather-Data-Api (Weather Image) Error:', error);

        });
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Helper Current Weather Image Function (Uses switch case with api response data given) - Jimin
function getWeatherImage(condition) {
    let imageWeather;

    const lowerCondition = condition.toLowerCase();

    if (lowerCondition.includes('mist')) {
        imageWeather = 'images/rain.png';
    } else if (lowerCondition.includes('clouds')) {
        imageWeather = 'images/clouds.png';
    } else if (lowerCondition.includes('snow')) {
        imageWeather = 'images/snow.png';
    } else if (lowerCondition.includes('clear')) {
        imageWeather = 'images/sun.png';
    } else if (lowerCondition.includes('rain')) {
        imageWeather = 'images/thunder.png';
    } else if (lowerCondition.includes('haze')) {
        imageWeather = 'images/haze.png';
    } else {
        imageWeather = 'images/default.png';
    }

    return imageWeather;
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Helper This function updates the weather details by calling & fetching the api, display the content and catches errors - Jimin
function updateWeatherDetails(lat, lon) {
    const currentweatherdataApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

    fetch(currentweatherdataApi)
        .then(response => response.json())
        .then(weatherData => {

            document.getElementById('temperature').innerHTML = `<br>
            High: ${weatherData.main.temp_max} °F
            <br>
            Low: ${weatherData.main.temp_min} °F`;
            document.getElementById('humidity').innerText = `${weatherData.main.humidity}%`;
            document.getElementById('wind').innerText = `${weatherData.wind.speed} m/s, ${weatherData.wind.deg}°`;
            document.getElementById('visibility').innerText = `${weatherData.visibility} meters`;
            document.getElementById('cloudCover').innerText = `${weatherData.clouds.all}%`;
            document.getElementById('sunrise').innerText = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
            document.getElementById('sunset').innerText = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
        })
        .catch(error => {
            console.error('Fetching Current-Weather-Data-Api (Weather Details) Error:', error);
        });
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// function uses lat and lon to fetch data from api for hourly weather data, uses helper functions to update hourly and daily innter text sections - Jason
function hourlyAndDaily(lat, lon) {
    const currentweatherdataApi = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${paid_key}`
    fetch(currentweatherdataApi)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Data:", data); // print data in so we can work with it visually

            hourlyText(data);
            dailyText(data);
            if (data.alerts && data.alerts.length > 0) {
                displayAlerts(data.alerts); // Call a function to display the alerts on the webpage
            } else {
                console.log('No alerts for this location.');
                const alertsContainer = document.querySelector('.weather-alerts-container');
                alertsContainer.innerHTML = '<p>No weather alerts for this location.</p>';
               
                
            }
        })
    }
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Helper function uses openweathermap's One Call 3.0 API json array to update inner text of hourly section to display weather data of searched location - Jason
function hourlyText(arr) {
    for (let i=1; i<13; i++) {
        // hourly weather data being displayed
        const hour = unixToHour(arr["hourly"][i-1]["dt"]);
        const temp = arr["hourly"][i-1]["temp"];
        const feelsLike = arr["hourly"][i-1]["feels_like"];
        const wind = arr["hourly"][i-1]["wind_speed"];

        // sets inner text for the hourly section for next 12 hours
        const temp_div = document.querySelector(`.hour${i}`);
        temp_div.innerHTML = 
        `${hour}<br><br>
        ${temp}°F<br><br>
        Feels Like: <br>${feelsLike}°F<br><br>
        Wind: <br>${wind}mph`
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Helper function uses openweathermap's One Call 3.0 API json array to update inner text of hourly section to display weather data of searched location - Jason
function dailyText(arr) {
    for (let i=1; i<8; i++) {
        // daily weather data being displayed
        const date = unixToDay(arr["daily"][i]["dt"]);
        const min = arr["daily"][i]["temp"]["min"];
        const max = arr["daily"][i]["temp"]["max"];
        const summary = arr["daily"][i]["summary"];
        const humidity = arr["daily"][i]["humidity"];
        const uvi = arr["daily"][i]["uvi"];
        const sunrise = new 
        Date(arr["daily"][i]["sunrise"] * 1000)
        .toLocaleTimeString();
        const sunset = new 
        Date(arr["daily"][i]["sunset"] * 1000)
        .toLocaleTimeString();

        // set inner text for daily section for next 7 days (excludes current day as it's displayed above)
        const temp_div = document.querySelector(`.day${i}`);temp_div.innerHTML = 
        `${date}<br><br>
        ${summary}<br><br>
        High: ${max}°F<br><br>
        Low: ${min}°F<br><br>
        Humidity: ${humidity}%<br>
        UV Index: ${uvi}<br>
        Sunrise: ${sunrise}<br>
        Sunset: ${sunset}`;
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Helper function to convert unix timestamp to a String representing day of the week - Jason
function unixToDay(num) {
    const date = new Date(num*1000);
    const weekday = date.toLocaleDateString('en-US', {weekday: 'long'});
    return weekday;
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Helper function to convert unix timestamp to a String representing the hour - Jason
function unixToHour(num) {
    const date = new Date(num*1000);
    let time = date.getHours();
    // if statements to format
    if (time == 0) {
        return "12AM";
    }
    else if (time >= 1 && time <= 11) {
        return `${time}AM`;
    }
    else if (time == 12) {
        return "12PM";
    }
    else {
        time = time-12;
        return `${time}PM`;
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// function handles displays of weather alerts in the HTML - Destin
function displayAlerts(alert) {
    const alertsContainer = document.querySelector('.weather-alerts-container');
    
  
        alertsContainer.innerHTML = ''; // Clear any  alerts

        alert.forEach(alerts => {
            const alertElement = document.createElement('div');
            alertElement.classList.add('weather-alert');

            const sender = document.createElement('p');
            sender.innerText = `Sender: ${alerts.sender_name}`;

            const event = document.createElement('p');
            event.innerText = `Event: ${alerts.event}`;

            const start = new Date(alerts.start * 1000).toLocaleString();
            const end = new Date(alerts.end * 1000).toLocaleString();

            const duration = document.createElement('p');
            duration.innerText = `Duration: ${start} to ${end}`;

            const description = document.createElement('p');
            description.innerText = `Description: ${alerts.description}`;

            const tags = document.createElement('p');
            tags.innerText = `Tags: ${alerts.tags}`;

            alertElement.appendChild(sender);
            alertElement.appendChild(event);
            alertElement.appendChild(duration);
            alertElement.appendChild(description);
            alertElement.appendChild(tags);

            alertsContainer.appendChild(alertElement);
        });
    
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
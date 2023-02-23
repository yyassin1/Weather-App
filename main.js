const weather = document.querySelector(".weather");
const address = document.getElementById("location");
const searchIcon = document.querySelector(".fa-search");

var modeToggle = document.getElementById("mode-toggle");
modeToggle.addEventListener("click", function () {
  document.body.classList.toggle("night-mode");
  modeToggle.classList.toggle("night-mode");
  if (document.body.classList.contains("night-mode")) {
    modeToggle.querySelector(".toggle-text").innerText = "Dark Mode";
  } else {
    modeToggle.querySelector(".toggle-text").innerText = "Light Mode";
  }
});

searchIcon.addEventListener("click", () => {
  getWeatherData(address.value)
    .then((weatherData) => {
      // Display the weather data
      const locationElement = document.createElement("h2");
      locationElement.innerHTML = weatherData.location;

      const descriptionElement = document.createElement("p");
      descriptionElement.innerHTML = weatherData.description;

      const temperatureElement = document.createElement("p");
      temperatureElement.className = "temperature-value";
      let fahrenheitValue = weatherData.temperature * 1.8 + 32;
      temperatureElement.innerHTML = `<strong>Temperature: </strong>${fahrenheitValue.toFixed(
        1
      )}&deg;F`;

      const feelsLikeElement = document.createElement("p");
      feelsLikeElement.className = "feels-like-value";
      let feelsLikeValueFarhanite = weatherData.feelsLike * 1.8 + 32;
      feelsLikeElement.innerHTML = `<strong>Feels like: </strong> ${feelsLikeValueFarhanite.toFixed(
        1
      )}&deg;F`;

      const windSpeedElement = document.createElement("p");
      windSpeedElement.innerHTML = `<strong>Humidity: </strong>${weatherData.humidity}%`;

      const humidityElement = document.createElement("p");
      humidityElement.innerHTML = `<strong>Wind speed: </strong>${weatherData.windSpeed} m/s`;

      const sunriseElement = document.createElement("p");
      sunriseElement.innerHTML = `<strong>Sunrise: </strong>${weatherData.sunrise.toLocaleTimeString()}`;

      const sunsetElement = document.createElement("p");
      sunsetElement.innerHTML = `<strong>Sunset: </strong>${weatherData.sunset.toLocaleTimeString()}`;

      const temperatureControler = document.createElement("button");
      temperatureControler.id = "temperature-controller";
      temperatureControler.innerHTML = `°F`;

      weather.innerHTML = "";
      weather.appendChild(locationElement);
      weather.appendChild(descriptionElement);
      weather.appendChild(temperatureElement);
      weather.appendChild(feelsLikeElement);
      weather.appendChild(humidityElement);
      weather.appendChild(windSpeedElement);
      weather.appendChild(sunriseElement);
      weather.appendChild(sunsetElement);
      weather.appendChild(temperatureControler);

      temperatureControler.addEventListener("click", () => {
        const temperatureValue = document.querySelector(".temperature-value");
        const feelsLikeValue = document.querySelector(".feels-like-value");
        const currentUnit = temperatureControler.innerHTML;

        if (currentUnit === "°C") {
          fahrenheitValue = weatherData.temperature * 1.8 + 32;
          temperatureValue.innerHTML = `<strong>Temperature: </strong>${fahrenheitValue.toFixed(
            1
          )}&deg;F`;
          feelsLikeValueFarhanite = weatherData.feelsLike * 1.8 + 32;
          feelsLikeValue.innerHTML = `<strong>Feels like: </strong> ${feelsLikeValueFarhanite.toFixed(
            1
          )}&deg;F`;
          temperatureControler.innerHTML = "°F";
        } else {
          temperatureValue.innerHTML = `<strong>Temperature: </strong>${weatherData.temperature.toFixed(
            1
          )}&deg;C`;
          feelsLikeValue.innerHTML = `<strong>Feels like: </strong> ${weatherData.feelsLike.toFixed(
            1
          )}&deg;C`;
          temperatureControler.innerHTML = "°C";
        }
      });
    })

    .catch((error) => {
      // Display the error message
      weather.textContent = error.message;
    });
});

async function getWeatherData(location) {
  if (!location) {
    throw new Error("Please enter a location");
  }

  const apiKey = "c58db153f35b0dfd11221ea7b0804ab9";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const weather = {
    location: `${data.name}, ${data.sys.country}`,
    description: data.weather[0].description,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    sunrise: new Date(data.sys.sunrise * 1000),
    sunset: new Date(data.sys.sunset * 1000),
  };

  return weather;
}

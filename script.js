const apiKey = "dac237a281a8316a40e748e4d132e6f2";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const toggleTempBtn = document.getElementById("toggleTemp");
const weatherInfo = document.getElementById("weatherInfo");
const forecastDiv = document.getElementById("forecast");
const timeDateDiv = document.getElementById("timeDate");
const weatherAnimation = document.getElementById("weatherAnimation");

let currentTempUnit = "C"; // C or F
let currentCityCoords = null;


searchBtn.addEventListener("click", () => {
  if(cityInput.value.trim() === "") {
    alert("Please enter a city name");
    return;
  }
  fetchWeatherByCity(cityInput.value.trim());
});

toggleTempBtn.addEventListener("click", () => {
  if (!currentCityCoords) return;
  currentTempUnit = currentTempUnit === "C" ? "F" : "C";
  toggleTempBtn.textContent = currentTempUnit === "C" ? "°F" : "°C";
  fetchWeatherByCoords(currentCityCoords.lat, currentCityCoords.lon);
});

window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        currentCityCoords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        fetchWeatherByCoords(currentCityCoords.lat, currentCityCoords.lon);
      },
      () => {
        // If denied, default city
        fetchWeatherByCity("New York");
      }
    );
  } else {
    fetchWeatherByCity("New York");
  }
};

function fetchWeatherByCity(city) {
  fetch(https//api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => {
      currentCityCoords = { lat: data.coord.lat, lon: data.coord.lon };
      showWeather(data);
      fetchForecast(currentCityCoords.lat, currentCityCoords.lon);
      startLocalTime(data.timezone);
    })
    .catch(err => {
      weatherInfo.innerHTML = <p>${err.message}</p>;
      forecastDiv.innerHTML = "";
      timeDateDiv.textContent = "";
      weatherAnimation.innerHTML = "";
    })
  )
}

function fetchWeatherByCoords(lat, lon) {
  fetch(https,//api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric)
    then(res => {
      if (!res.ok) throw new Error("Weather info not found");
      return res.json();
    })
    .then(data => {
      showWeather(data);
      fetchForecast(lat, lon);
      startLocalTime(data.timezone);
    })
    .catch(err => {
      weatherInfo.innerHTML = <p>${err.message}</p>;
      forecastDiv.innerHTML = "";
      timeDateDiv.textContent = "";
      weatherAnimation.innerHTML = "";
    })
  )
}

function showWeather(data) {
  const iconCode = data.weather[0].icon;
  const description = data.weather[0].description;
  const tempC = data.main.temp;
  const cityName = data.name;
  const country = data.sys.country;

  let displayTemp = currentTempUnit === "C" ? Math.round(tempC) + "°C" : Math.round(cToF(tempC)) + "°F";

  const background = chooseBackground(data.weather[0].main);
  document.body.style.background = background;
  setWeatherAnimation(data.weather[0].main);

  weatherInfo.innerHTML = `
    <img class="weather-icon" src="https://openweathermap.org/img/wn/${iconCode}@4x.png" alt="${description}" />
    <h2>${cityName}, ${country}</h2>
    <p>${description}</p>
    <h1>${displayTemp}</h1>
  `;
}

function fetchForecast(lat, lon) {
  // OpenWeatherMap 5 day / 3 hour forecast endpoint
  fetch(https,//api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric)
    then(res => {
      if (!res.ok) throw new Error("Forecast not found");
      return res.json();
    })
    .then(data => {
      // Extract one forecast per day at noon approx
      const daily = [];
      const now = new Date();

      for (let i = 0; i < data.list.length; i++) {
        const forecastDate = new Date(data.list[i].dt * 1000);
        if (forecastDate.getHours() === 12 && forecastDate > now) {
          daily.push(data.list[i]);
          if (daily.length === 5) break;
        }
      }
      showForecast(daily);
    })
    .catch(() => {
      forecastDiv.innerHTML = "<p>Forecast unavailable</p>";
    })
  )
}

function showForecast(daily) {
  if (daily.length === 0) {
    forecastDiv.innerHTML = "<p>No forecast data</p>";
    return;
  }

  forecastDiv.innerHTML = daily.map(f => {
    const date = new Date(f.dt * 1000);
    const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
    const icon = f.weather[0].icon;
    const tempC = f.main.temp;
    const temp = currentTempUnit === "C" ? Math.round(tempC) + "°" : Math.round(cToF(tempC)) + "°";
    return `
      <div class="forecast-day">
        <div>${dayName}</div>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${f.weather[0].description}" />
        <div>${temp}</div>
      </div>
    `;
  }).join('');
}
function cToF(c) {
  return c * 9 / 5 + 32;
}
function chooseBackground(weather) {
  switch(weather.toLowerCase()) {
    case "clear": return "linear-gradient(to right, #fceabb, #f8b500)";
    case "clouds": return "linear-gradient(to right, #bdc3c7, #2c3e50)";
    case "rain":
    case "drizzle": return "linear-gradient(to right, #4ca1af, #c4e0e5)";
    case "snow": return "linear-gradient(to right, #83a4d4, #b6fbff)";
    case "thunderstorm": return "linear-gradient(to right, #373b44, #4286f4)";
    default: return "linear-gradient(to right, #74ebd5, #ACB6E5)";
  }
}
function clearWeatherAnimations() {
  weatherAnimation.innerHTML = "";
}
function createClouds() {
  clearWeatherAnimations();
  for(let i=0; i<6; i++) {
    const cloud = document.createElement("div");
    cloud.classList.add("cloud");
    cloud.style.width = `${50 + Math.random()*50}px`;
    cloud.style.height = `${30 + Math.random()*20}px`;
    cloud.style.top = `${Math.random() * 40}vh`;
    cloud.style.left = `-${100 + Math.random()*200}px`;
    cloud.style.animationDuration = `${30 + Math.random()*20}s`;
    cloud.style.animationName = "cloudMove";
    cloud.style.animationDelay = `${i*5}s`;
    weatherAnimation.appendChild(cloud);
  }
}
function createRain() {
  clearWeatherAnimations();
  for(let i=0; i<50; i++) {
    const drop = document.createElement("div");
    drop.classList.add("rain-drop");
    drop.style.left = `${Math.random() * 100}vw`;
    drop.style.animationDuration = `${0.5 + Math.random()*0.7}s`;
    drop.style.animationDelay = `${Math.random()*3}s`;
    drop.style.top = `${-20 - Math.random()*100}px`;
    weatherAnimation.appendChild(drop);
  }
}
function createSnow() {
  clearWeatherAnimations();
  for(let i=0; i<40; i++) {
    const flake = document.createElement("div");
    flake.classList.add("snowflake");
    flake.style.left = `${Math.random() * 100}vw`;
    flake.style.animationDuration = `${5 + Math.random()*5}s`;
    flake.style.animationDelay = `${Math.random()*5}s`;
    flake.style.top = `${-10 - Math.random()*50}px`;
    weatherAnimation.appendChild(flake);
  }
}
function setWeatherAnimation(weather) {
  const w = weather.toLowerCase();
  if(w === "clear") {
    clearWeatherAnimations();
  } else if (w === "clouds") {
    createClouds();
  } else if (w === "rain" || w === "drizzle") {
    createRain();
  } else if (w === "snow") {
    createSnow();
  } else if (w === "thunderstorm") {
    createRain();
    createClouds();
  } else {
    clearWeatherAnimations();
  }
}
let timeInterval;

function startLocalTime(timezoneOffset) {
  if(timeInterval) clearInterval(timeInterval);

  function updateTime() {
    const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
    const localTime = new Date(utc + (timezoneOffset * 1000));
    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: true };
    timeDateDiv.textContent = localTime.toLocaleDateString(undefined, {month: 'long', day: 'numeric'}) + ' | ' + localTime.toLocaleTimeString(undefined, options);
  }
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
}

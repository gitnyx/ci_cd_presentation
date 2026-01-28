// =====================
// CONFIG
// =====================
export const API_KEY = "23cdee0774e73881c1344ae4375658ba";

// =====================
// API FUNCTIONS (TESTABLE)
// =====================

export async function fetchCities(query) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch cities");
  }

  return response.json();
}

export async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch weather");
  }

  return response.json();
}

export function formatWeatherData(data) {
  return {
    temp: Math.round(data.main.temp),
    wind: data.wind.speed,
    icon: data.weather[0].icon,
    description: data.weather[0].description
  };
}

// =====================
// DOM ELEMENTS
// =====================
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const resultsList = document.getElementById("results");
const weatherDiv = document.getElementById("weather");

// =====================
// EVENT LISTENERS
// =====================
if (searchBtn) {
  searchBtn.addEventListener("click", onSearchClick);
}

// =====================
// UI LOGIC
// =====================

async function onSearchClick() {
  const query = cityInput.value.trim();
  if (!query) return;

  resultsList.innerHTML = "";
  weatherDiv.innerHTML = "";

  try {
    const cities = await fetchCities(query);

    if (cities.length === 0) {
      resultsList.innerHTML = "<li>No results found</li>";
      return;
    }

    cities.forEach(city => {
      const li = document.createElement("li");
      li.textContent = `${city.name}, ${city.country}`;
      li.classList.add("city-item");

      li.addEventListener("click", () => {
        loadWeather(city.lat, city.lon);
      });

      resultsList.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    resultsList.innerHTML = "<li>Error loading cities</li>";
  }
}

async function loadWeather(lat, lon) {
  weatherDiv.innerHTML = "Loading weather...";

  try {
    const data = await fetchWeather(lat, lon);
    const weather = formatWeatherData(data);
    renderWeather(weather);
  } catch (error) {
    console.error(error);
    weatherDiv.innerHTML = "Error loading weather";
  }
}

// =====================
// RENDERING
// =====================

function renderWeather(weather) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  weatherDiv.innerHTML = `
    <div class="weather-card">
      <img src="${iconUrl}" alt="${weather.description}" />
      <div class="weather-info">
        <div class="temp">${weather.temp}°C</div>
        <div class="wind">💨 ${weather.wind} m/s</div>
        <div class="desc">${weather.description}</div>
      </div>
    </div>
  `;
}
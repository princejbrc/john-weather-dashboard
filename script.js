
// Coordinates for each location
const coords = {
  guntersville: { lat: 34.3589, lon: -86.2940 },
  stpete: { lat: 27.7350, lon: -82.7429 }
};

// Fetch weather data using NOAA API
async function fetchWeather(location, elementId, riskId) {
  const { lat, lon } = coords[location];
  const pointUrl = `https://api.weather.gov/points/${lat},${lon}`;
  try {
    const pointRes = await fetch(pointUrl, {
      headers: {
        'User-Agent': 'john-weather-dashboard (contact@example.com)',
        'Accept': 'application/ld+json'
      }
    });
    const pointData = await pointRes.json();
    const forecastUrl = pointData.properties?.forecast;

    if (!forecastUrl) {
      throw new Error('No forecast URL in point data');
    }

    const res = await fetch(forecastUrl, {
      headers: {
        'User-Agent': 'john-weather-dashboard (contact@example.com)',
        'Accept': 'application/ld+json'
      }
    });
    const data = await res.json();

    if (data && data.properties && data.properties.periods) {
      const forecast = data.properties.periods[0];
      const text = `${forecast.name}: ${forecast.temperature}°${forecast.temperatureUnit} - ${forecast.detailedForecast}`;
      document.getElementById(elementId).textContent = text;

      const lower = forecast.detailedForecast.toLowerCase();
      let risk = 'LOW';
      if (lower.includes('thunderstorm') || lower.includes('rain') || lower.includes('snow')) {
        risk = 'HIGH';
      }
      document.getElementById(riskId).textContent = `Risk: ${risk}`;
    } else {
      document.getElementById(elementId).textContent = 'Weather data unavailable.';
      document.getElementById(riskId).textContent = 'Risk: N/A';
    }
  } catch (error) {
    console.error('Weather API error:', error);
    document.getElementById(elementId).textContent = 'Weather data unavailable.';
    document.getElementById(riskId).textContent = 'Risk: N/A';
  }
}

// Tab switching logic
function showTab(target) {
  document.querySelectorAll('.tab-content').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById(target).style.display = 'block';

  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`.tab-button[data-target="${target}"]`).classList.add('active');
}

// Initialize event listeners
function init() {
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
      showTab(btn.dataset.target);
    });
  });

  // Fetch weather for both locations
  fetchWeather('guntersville', 'weather-guntersville', 'risk-guntersville');
  fetchWeather('stpete', 'weather-stpete', 'risk-stpete');
}

document.addEventListener('DOMContentLoaded', init);

// Coordinates and timezone for each location
const coords = {
    guntersville: { lat: 34.3589, lon: -86.2940, timezone: 'America/Chicago' },    stpete: { lat: 27.7429, lon: -82.7429, timezone: 'America/New_York' }
};

// Map Open-Meteo weather codes to descriptions
function weatherCodeToDescription(code) {
    const thunderstorm = [95, 96, 99];
    const snow = [71, 73, 75, 77, 85, 86];
    const rain = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82];
    if (thunderstorm.includes(code)) return 'Thunderstorm';
    if (snow.includes(code)) return 'Snow';

    if (rain.includes(code)) return 'Rain';
    if (code === 45 || code === 48) return 'Fog';
    return 'Clear';
}

// Fetch current weather from Open-Meteo
function fetchWeather(locationKey, weatherId, riskId) {
    const { lat, lon } = coords[locationKey];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.current_weather) {
                const cw = data.current_weather;
                const desc = weatherCodeToDescription(cw.weathercode);
                const tempC = cw.temperature;
                const tempF = (tempC * 9/5 + 32).toFixed(1);
                const text = `${desc} - ${tempF}\u00B0F`;
                document.getElementById(weatherId).textContent = text;
                let risk = 'Low';
                if (desc === 'Thunderstorm' || desc === 'Rain' || desc === 'Snow') {
                    risk = 'High';
                }
                document.getElementById(riskId).textContent = `Risk: ${risk}`;
            } else {
                document.getElementById(weatherId).textContent = 'Weather data unavailable';
                document.getElementById(riskId).textContent = 'Risk: N/A';
            }
        })
        .catch(() => {
            document.getElementById(weatherId).textContent = 'Weather data unavailable';
            document.getElementById(riskId).textContent = 'Risk: N/A';
        });
}

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

function init() {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', () => {
            showTab(btn.dataset.target);
        });
    });
    fetchWeather('guntersville', 'weather-guntersville', 'risk-guntersville');
    fetchWeather('stpete', 'weather-stpete', 'risk-stpete');
}

document.addEventListener('DOMContentLoaded', init);

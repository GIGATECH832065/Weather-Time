const apiKey = "534175a97d869045b9ddeeae4ca08028"; // 🔥 Replace with your actual API key

const cities = [
    { name: "London", timeZone: "Europe/London", tempElement: "londonTemp", timeElement: "londonTime", lat: 51.5074, lon: -0.1278 },
    { name: "Beijing", timeZone: "Asia/Shanghai", tempElement: "beijingTemp", timeElement: "beijingTime", lat: 39.9042, lon: 116.4074 },
    { name: "New York", timeZone: "America/New_York", tempElement: "newYorkTemp", timeElement: "newYorkTime", lat: 40.7128, lon: -74.0060 },
    { name: "Honolulu", timeZone: "Pacific/Honolulu", tempElement: "honoluluTemp", timeElement: "honoluluTime", lat: 21.3069, lon: -157.8583 }
];

async function fetchWeather(city) {
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=imperial&appid=${apiKey}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (data.main && data.main.temp !== undefined) {
            document.getElementById(city.tempElement).textContent = `Temp: ${data.main.temp}°F`;
        } else {
            document.getElementById(city.tempElement).textContent = "Temp unavailable.";
        }
    } catch (error) {
        console.error(`Error fetching weather for ${city.name}:`, error);
        document.getElementById(city.tempElement).textContent = "Weather data not available.";
    }
}

function updateTime() {
    cities.forEach(city => {
        const now = new Date();
        const cityTime = now.toLocaleTimeString("en-US", {
            timeZone: city.timeZone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });
        document.getElementById(city.timeElement).textContent = `Time: ${cityTime}`;
    });
}

async function fetchLocalWeather() {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            document.getElementById("localTemp").textContent = `Your Local Temp: ${data.main.temp}°F`;
        } catch {
            document.getElementById("localTemp").textContent = "Local temp unavailable.";
        }
    });
}

function searchGoogle() {
    const query = document.getElementById("searchQuery").value;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
}

updateTime();
fetchLocalWeather();
cities.forEach(city => fetchWeather(city));

setInterval(updateTime, 2000); // ⏳ Update time every 2 seconds
setInterval(fetchLocalWeather, 60000); // 🌡️ Update local temp every 1 min
setInterval(() => cities.forEach(city => fetchWeather(city)), 10000); // 🌍 Update city weather every 10 sec

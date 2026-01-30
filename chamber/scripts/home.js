// DOM Elements
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
const weatherWidget = document.getElementById('weather-widget'); // FIXED: getElementById (was getElemntById)
const spotlightsContainer = document.getElementById('spotlights-container');

// =====================================================
// HAMBURGER MENU
// =====================================================
hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);

    if (nav.classList.contains('active')) {
        hamburger.textContent = '✕'; // FIXED: Changed 'X' to '✕' for consistency
    } else {
        hamburger.textContent = '☰';
    }
});

// Close menu when clicking on nav links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.textContent = '☰';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.textContent = '☰';
    }
});

// =====================================================
// WEATHER API - Current + 3-Day Forecast
// =====================================================
const getWeather = async () => {
    const apiKey = '01700056657c51e2b04b4c7c46d3f230'; // OpenWeatherMap API key
    const lat = 6.3350; // Benin City latitude
    const lon = 5.6037; // Benin City longitude

    // Forecast API for current + 3-day forecast
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        displayFallbackWeather();
    }
}

const displayWeather = (data) => {
    // Current weather (first item in list)
    const current = data.list[0];
    const temp = Math.round(current.main.temp);
    const description = current.weather[0].description;
    const humidity = current.main.humidity;
    const icon = current.weather[0].icon;
    
    // Get 3-day forecast
    const forecast = get3DayForecast(data.list);

    weatherWidget.innerHTML = `
        <div class="weather-container">
            <div class="weather-current">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" 
                     alt="${description}" 
                     class="weather-icon">
                <div class="weather-details">
                    <p class="weather-temp">${temp}°C</p>
                    <p class="weather-desc">${description}</p>
                    <p class="weather-humidity">💧 Humidity: ${humidity}%</p>
                </div>
            </div>

            <div class="weather-forecast">
                <h3>3-Day Forecast</h3>
                <div class="forecast-grid">
                    ${forecast.map(day => `
                        <div class="forecast-day">
                            <p class="forecast-date">${day.date}</p>
                            <img src="https://openweathermap.org/img/wn/${day.icon}.png" 
                                 alt="${day.description}">
                            <p class="forecast-temp">${day.temp}°C</p>
                            <p class="forecast-desc">${day.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

const get3DayForecast = (forecastList) => {
    const days = [];
    const today = new Date().getDate();
    const processedDays = new Set();
    
    // Get one forecast per day (around noon - 12:00)
    for (let item of forecastList) {
        const date = new Date(item.dt * 1000);
        const day = date.getDate();
        const hour = date.getHours();
        
        // Skip today and get noon readings (12:00) for next 3 days
        if (day !== today && !processedDays.has(day) && hour === 12) {
            processedDays.add(day);
            days.push({
                date: formatDate(date),
                temp: Math.round(item.main.temp),
                description: item.weather[0].description,
                icon: item.weather[0].icon
            });
            
            if (days.length === 3) break;
        }
    } // FIXED: Added missing closing brace

    // If we didn't get 3 days at noon, use alternative method
    if (days.length < 3) {
        return getAlternativeForecast(forecastList); // FIXED: Spelling (was getAlternativeForcast)
    }

    return days;
}

const getAlternativeForecast = (forecastList) => { // FIXED: Added missing function
    const days = [];
    const processedDays = new Set();
    const today = new Date().getDate();
    
    for (let item of forecastList) {
        const date = new Date(item.dt * 1000);
        const day = date.getDate();
        
        if (day !== today && !processedDays.has(day)) {
            processedDays.add(day);
            days.push({
                date: formatDate(date),
                temp: Math.round(item.main.temp),
                description: item.weather[0].description,
                icon: item.weather[0].icon
            });
            
            if (days.length === 3) break;
        }
    }
    
    return days;
}

const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
}

function displayFallbackWeather() {
    weatherWidget.innerHTML = `
        <div class="weather-container">
            <div class="weather-current">
                <div class="weather-details">
                    <p class="weather-temp">28°C</p>
                    <p class="weather-desc">Partly Cloudy</p>
                    <p class="weather-humidity">💧 Humidity: 75%</p>
                    <p class="weather-note">Weather data currently unavailable</p>
                </div>
            </div>
            
            <div class="weather-forecast">
                <h3>3-Day Forecast</h3>
                <div class="forecast-grid">
                    <div class="forecast-day">
                        <p class="forecast-date">Tomorrow</p>
                        <p class="forecast-temp">29°C</p>
                        <p class="forecast-desc">Sunny</p>
                    </div>
                    <div class="forecast-day">
                        <p class="forecast-date">Day 2</p>
                        <p class="forecast-temp">27°C</p>
                        <p class="forecast-desc">Cloudy</p>
                    </div>
                    <div class="forecast-day">
                        <p class="forecast-date">Day 3</p>
                        <p class="forecast-temp">28°C</p>
                        <p class="forecast-desc">Clear</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// =====================================================
// BUSINESS SPOTLIGHTS - Gold/Silver Members Only
// =====================================================
const getSpotlights = async () => {
    try {
        const response = await fetch('data/members.json');
        const data = await response.json();
        
        // Filter ONLY gold (3) and silver (2) members
        const qualifiedMembers = data.members.filter(
            member => member.membershipLevel === 2 || member.membershipLevel === 3
        );

        // Randomly select 2-3 members for spotlight
        const spotlightCount = Math.random() < 0.5 ? 2 : 3;
        const spotlights = getRandomMembers(qualifiedMembers, spotlightCount);
        displaySpotlights(spotlights);
    } catch (error) {
        console.error('Error fetching spotlights:', error);
        spotlightsContainer.innerHTML = '<p>Unable to load member spotlights.</p>';
    }
}

function getRandomMembers(members, count) {
    // Shuffle array and select first 'count' items
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displaySpotlights(members) {
    spotlightsContainer.innerHTML = '';
    
    members.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('spotlight-card');
        
        // Get membership badge
        const badge = getMembershipBadge(member.membershipLevel);
        
        card.innerHTML = `
            <div class="spotlight-logo">
                <img src="${member.image}" 
                     alt="${member.name} logo" 
                     class="spotlight-image" 
                     loading="lazy">
            </div>
            <div class="spotlight-info">
                <h3>${member.name}</h3>
                ${badge}
                <p class="spotlight-address">
                    <strong>📍 Address:</strong><br>
                    ${member.address}
                </p>
                <p class="spotlight-phone">
                    <strong>📞 Phone:</strong><br>
                    ${member.phone}
                </p>
                <p class="spotlight-website">
                    <strong>🌐 Website:</strong><br>
                    <a href="${member.website}" target="_blank" rel="noopener">
                        ${member.website}
                    </a>
                </p>
            </div>
        `;
        
        spotlightsContainer.appendChild(card);
    });
}

function getMembershipBadge(level) {
    switch(level) {
        case 3:
            return '<span class="membership-badge badge-gold">⭐ Gold Member</span>';
        case 2:
            return '<span class="membership-badge badge-silver">🥈 Silver Member</span>';
        default:
            return '';
    }
}

// =====================================================
// FOOTER DATES
// =====================================================
document.getElementById('currentYear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Modified: ${document.lastModified}`;

// =====================================================
// INITIALIZE - Load all dynamic content
// =====================================================
getWeather();
getSpotlights();
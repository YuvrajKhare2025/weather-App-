// Weather App JavaScript
class WeatherApp {
    constructor() {
        this.apiKey = ''; // You'll need to get a free API key from OpenWeatherMap
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadDefaultWeather();
    }

    bindEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const cityInput = document.getElementById('cityInput');

        searchBtn.addEventListener('click', () => this.searchWeather());
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });

        // Auto-complete animation for input
        cityInput.addEventListener('focus', () => {
            cityInput.style.transform = 'scale(1.02)';
        });

        cityInput.addEventListener('blur', () => {
            cityInput.style.transform = 'scale(1)';
        });
    }

    async loadDefaultWeather() {
        // Try to get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.getWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    this.getWeatherByCity('London'); // Default city
                }
            );
        } else {
            this.getWeatherByCity('London');
        }
    }

    async searchWeather() {
        const city = document.getElementById('cityInput').value.trim();
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        await this.getWeatherByCity(city);
    }

    async getWeatherByCity(city) {
        this.showLoading();
        
        try {
            // For demo purposes, we'll use mock data
            // In production, replace with actual API call
            setTimeout(() => {
                this.displayWeather(this.getMockWeatherData(city));
                this.displayForecast(this.getMockForecastData());
            }, 1500);
            
        } catch (error) {
            this.showError('Weather data not available');
        }
    }

    async getWeatherByCoords(lat, lon) {
        this.showLoading();
        
        // Mock implementation - replace with actual API call
        setTimeout(() => {
            this.displayWeather(this.getMockWeatherData('Your Location'));
            this.displayForecast(this.getMockForecastData());
        }, 1500);
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('weatherContent').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('weatherContent').style.display = 'block';
    }

    displayWeather(data) {
        this.hideLoading();

        // Animate content update
        const weatherContent = document.getElementById('weatherContent');
        weatherContent.style.animation = 'none';
        weatherContent.offsetHeight; // Trigger reflow
        weatherContent.style.animation = 'fadeIn 1s ease-out';

        // Update weather data
        document.getElementById('cityName').textContent = data.city;
        document.getElementById('country').textContent = data.country;
        document.getElementById('temperature').textContent = data.temperature;
        document.getElementById('weatherDesc').textContent = data.description;
        document.getElementById('visibility').textContent = data.visibility;
        document.getElementById('humidity').textContent = data.humidity;
        document.getElementById('windSpeed').textContent = data.windSpeed;
        document.getElementById('feelsLike').textContent = data.feelsLike;

        // Update weather icon with animation
        const weatherIcon = document.getElementById('weatherIcon');
        const iconElement = this.getWeatherIcon(data.condition);
        weatherIcon.innerHTML = iconElement;

        // Add weather-specific animation class
        weatherIcon.className = `weather-icon ${this.getWeatherAnimationClass(data.condition)}`;

        // Update background based on weather
        this.updateBackground(data.condition);
    }

    displayForecast(forecastData) {
        const container = document.getElementById('forecastContainer');
        container.innerHTML = '';

        forecastData.forEach((item, index) => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.style.animationDelay = `${index * 0.1}s`;
            
            forecastItem.innerHTML = `
                <div class="forecast-day">${item.day}</div>
                <div class="forecast-icon">${this.getWeatherIcon(item.condition)}</div>
                <div class="forecast-temp">${item.temp}°</div>
            `;
            
            container.appendChild(forecastItem);
        });
    }

    getWeatherIcon(condition) {
        const icons = {
            'clear': '<i class="fas fa-sun"></i>',
            'clouds': '<i class="fas fa-cloud"></i>',
            'rain': '<i class="fas fa-cloud-rain"></i>',
            'thunderstorm': '<i class="fas fa-bolt"></i>',
            'snow': '<i class="fas fa-snowflake"></i>',
            'mist': '<i class="fas fa-smog"></i>',
            'partly-cloudy': '<i class="fas fa-cloud-sun"></i>'
        };
        
        return icons[condition] || icons['clear'];
    }

    getWeatherAnimationClass(condition) {
        const classes = {
            'clear': 'sunny',
            'rain': 'rainy',
            'clouds': 'cloudy',
            'snow': 'snowy'
        };
        
        return classes[condition] || 'sunny';
    }

    updateBackground(condition) {
        const body = document.body;
        const gradients = {
            'clear': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'clouds': 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)',
            'rain': 'linear-gradient(135deg, #4B79A1 0%, #283E51 100%)',
            'snow': 'linear-gradient(135deg, #E6DEDD 0%, #D79922 100%)',
            'thunderstorm': 'linear-gradient(135deg, #2C3E50 0%, #4A6741 100%)'
        };

        body.style.background = gradients[condition] || gradients['clear'];
    }

    showError(message) {
        this.hideLoading();
        
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(231, 76, 60, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            animation: slideInFromRight 0.5s ease-out;
            z-index: 1000;
        `;

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // Mock data for demonstration
    getMockWeatherData(city) {
        const mockData = {
            city: city,
            country: 'Demo',
            temperature: Math.floor(Math.random() * 30) + 10,
            description: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
            condition: ['clear', 'partly-cloudy', 'clouds', 'rain'][Math.floor(Math.random() * 4)],
            visibility: '10 km',
            humidity: Math.floor(Math.random() * 50) + 30 + '%',
            windSpeed: Math.floor(Math.random() * 20) + 5 + ' km/h',
            feelsLike: Math.floor(Math.random() * 35) + 15 + '°C'
        };
        
        return mockData;
    }

    getMockForecastData() {
        const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri'];
        const conditions = ['clear', 'clouds', 'rain', 'partly-cloudy'];
        
        return days.map(day => ({
            day,
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            temp: Math.floor(Math.random() * 25) + 15
        }));
    }
}

// Initialize the weather app
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// Additional animations and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add interactive particle effects
    createInteractiveParticles();
    
    // Add weather card hover effects
    addCardInteractions();
});

function createInteractiveParticles() {
    const particles = document.querySelector('.particles');
    
    document.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.1) { // 10% chance to create particle on mouse move
            const particle = document.createElement('div');
            particle.className = 'interactive-particle';
            particle.style.cssText = `
                position: absolute;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                width: 6px;
                height: 6px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                pointer-events: none;
                animation: particleFade 2s ease-out forwards;
                z-index: 100;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    });
}

function addCardInteractions() {
    const weatherCard = document.querySelector('.weather-card');
    
    weatherCard.addEventListener('mouseenter', () => {
        weatherCard.style.transform = 'translateY(-10px) scale(1.02)';
        weatherCard.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.2)';
    });
    
    weatherCard.addEventListener('mouseleave', () => {
        weatherCard.style.transform = 'translateY(0) scale(1)';
        weatherCard.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
    });
}

// Add CSS for interactive particles
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFade {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(0);
        }
    }
`;
document.head.appendChild(style);

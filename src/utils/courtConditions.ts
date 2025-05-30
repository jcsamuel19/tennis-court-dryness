import type { WeatherData, CourtCondition } from '../types/weather';

const FREEZING_POINT_F = 32; // 32°F instead of 0°C
const COLD_TEMP_F = 41; // 5°C = 41°F
const HOT_TEMP_F = 77; // 25°C = 77°F
const HIGH_HUMIDITY_THRESHOLD = 90;
const RAIN_THRESHOLD = 0.1; // mm per hour
const HOURS_TO_CHECK = 2;

export const determineCourtCondition = (
    currentWeather: WeatherData,
    historicalData: WeatherData[]
): CourtCondition => {
    const currentTemp = currentWeather.main.temp;
    const currentHumidity = currentWeather.main.humidity;
    const currentRain = currentWeather.rain?.['1h'] || 0;

    // Check recent rain history
    const recentRainTotal = historicalData
        .slice(0, HOURS_TO_CHECK)
        .reduce((total, hour) => total + (hour.rain?.['1h'] || 0), 0);

    // Calculate playability score (0-100)
    let score = 100;
    let message = "Courts should be dry and playable";
    let isDry = true;
    let dryingTimeHours = 0;

    // Temperature penalties (now using Fahrenheit)
    if (currentTemp <= FREEZING_POINT_F) {
        score = 0;
        message = "Courts are likely icy and unplayable due to freezing temperatures";
        isDry = false;
        dryingTimeHours = 24; // Wait for warmer weather
    } else if (currentTemp < COLD_TEMP_F) {
        score -= 30;
        message = "Courts may be slippery due to cold temperatures";
        isDry = false;
        dryingTimeHours = 4;
    }

    // Current rain penalties
    if (currentRain > 0) {
        score = Math.min(score, 10);
        message = "Courts are wet - it's currently raining";
        isDry = false;
        dryingTimeHours = Math.max(dryingTimeHours, 2 + currentRain);
    }

    // Recent rain penalties
    if (recentRainTotal > RAIN_THRESHOLD) {
        const rainPenalty = Math.min(60, recentRainTotal * 20);
        score -= rainPenalty;
        if (score < 30) {
            message = `Courts are likely wet - ${recentRainTotal.toFixed(1)}mm of rain in the last ${HOURS_TO_CHECK} hours`;
            isDry = false;
            dryingTimeHours = Math.max(dryingTimeHours, recentRainTotal * 0.5);
        }
    }

    // Humidity penalties
    if (currentHumidity >= HIGH_HUMIDITY_THRESHOLD) {
        score -= 25;
        message = "Courts might be damp due to very high humidity";
        isDry = false;
        dryingTimeHours = Math.max(dryingTimeHours, 2);
    } else if (currentHumidity > 75) {
        score -= 10;
    }

    // Temperature bonuses for drying (now using Fahrenheit)
    if (currentTemp > HOT_TEMP_F) {
        score += 10;
        dryingTimeHours *= 0.7; // Heat helps drying
    }

    // Final score adjustments
    score = Math.max(0, Math.min(100, score));

    // Update message based on final score
    if (score >= 80) {
        message = "Perfect conditions for tennis!";
        isDry = true;
    } else if (score >= 60) {
        message = "Good conditions - courts should be playable";
        isDry = true;
    } else if (score >= 40) {
        message = "Fair conditions - court puddles could be spread to dry faster";
        isDry = false;
    } else if (score >= 20) {
        message = "Poor conditions - courts likely not ideal for play";
        isDry = false;
    } else {
        message = "Courts are not suitable for play";
        isDry = false;
    }

    return {
        isDry,
        message,
        score: Math.round(score),
        dryingTimeHours: Math.round(dryingTimeHours * 10) / 10,
        details: {
            temperature: currentTemp,
            humidity: currentHumidity,
            currentRain,
            recentRain: recentRainTotal
        }
    };
}; 
import type { WeatherData, CourtCondition } from '../types/weather';

const FREEZING_POINT_C = 0;
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

    // Check if temperature is below freezing
    if (currentTemp <= FREEZING_POINT_C) {
        return {
            isDry: false,
            message: "Courts are likely icy and unplayable due to freezing temperatures",
            details: {
                temperature: currentTemp,
                humidity: currentHumidity,
                currentRain,
                recentRain: 0
            }
        };
    }

    // Check current rain
    if (currentRain > 0) {
        return {
            isDry: false,
            message: "Courts are wet - it's currently raining",
            details: {
                temperature: currentTemp,
                humidity: currentHumidity,
                currentRain,
                recentRain: 0
            }
        };
    }

    // Check recent rain history
    const recentRainTotal = historicalData
        .slice(0, HOURS_TO_CHECK)
        .reduce((total, hour) => total + (hour.rain?.['1h'] || 0), 0);

    if (recentRainTotal > RAIN_THRESHOLD) {
        return {
            isDry: false,
            message: `Courts are likely wet - ${recentRainTotal.toFixed(1)}mm of rain in the last ${HOURS_TO_CHECK} hours`,
            details: {
                temperature: currentTemp,
                humidity: currentHumidity,
                currentRain,
                recentRain: recentRainTotal
            }
        };
    }

    // Check humidity
    if (currentHumidity >= HIGH_HUMIDITY_THRESHOLD) {
        return {
            isDry: false,
            message: "Courts might be damp due to very high humidity",
            details: {
                temperature: currentTemp,
                humidity: currentHumidity,
                currentRain,
                recentRain: recentRainTotal
            }
        };
    }

    // If all checks pass, courts should be playable
    return {
        isDry: true,
        message: "Courts should be dry and playable",
        details: {
            temperature: currentTemp,
            humidity: currentHumidity,
            currentRain,
            recentRain: recentRainTotal
        }
    };
}; 
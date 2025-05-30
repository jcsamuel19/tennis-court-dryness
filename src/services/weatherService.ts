import axios from 'axios';
import type { WeatherData } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherData = async (city: string): Promise<WeatherData> => {
    try {
        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'imperial'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Weather API Error:', error);
        throw new Error('Failed to fetch weather data');
    }
};

// Since historical data requires paid plan, we'll simulate recent rain data
// In a real app with paid plan, you'd use the historical weather API
export const getHistoricalData = async (_lat: number, _lon: number): Promise<WeatherData[]> => {
    // For demo purposes, we'll return empty array (no recent rain)
    // This means the app will only check current conditions
    return [];
}; 
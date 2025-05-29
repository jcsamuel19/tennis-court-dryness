import { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Card, 
    CardContent, 
    Typography, 
    CircularProgress,
    Alert
} from '@mui/material';
import type { CourtCondition } from '../types/weather';
import { getWeatherData, getHistoricalData } from '../services/weatherService';
import { determineCourtCondition } from '../utils/courtConditions';

export const TennisWeather = () => {
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [courtCondition, setCourtCondition] = useState<CourtCondition | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Check if API key is configured
        if (!import.meta.env.VITE_OPENWEATHER_API_KEY) {
            setError('OpenWeather API key is not configured. Please add VITE_OPENWEATHER_API_KEY to your .env file.');
            setLoading(false);
            return;
        }

        try {
            const currentWeather = await getWeatherData(city);
            const historicalData = await getHistoricalData(
                currentWeather.coord.lat,
                currentWeather.coord.lon
            );
            
            const condition = determineCourtCondition(currentWeather, historicalData);
            setCourtCondition(condition);
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to fetch weather data. Please check the city name and your API key.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Tennis Court Weather Checker
            </Typography>
            
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <TextField
                        fullWidth
                        label="Enter City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={loading}
                    />
                    <Button 
                        variant="contained" 
                        type="submit"
                        disabled={!city || loading}
                    >
                        Check
                    </Button>
                </Box>
            </form>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {courtCondition && (
                <Card>
                    <CardContent>
                        <Alert 
                            severity={courtCondition.isDry ? "success" : "warning"}
                            sx={{ mb: 2 }}
                        >
                            {courtCondition.message}
                        </Alert>
                        
                        <Typography variant="h6" gutterBottom>
                            Weather Details:
                        </Typography>
                        <Typography>
                            Temperature: {courtCondition.details.temperature}°C
                        </Typography>
                        <Typography>
                            Humidity: {courtCondition.details.humidity}%
                        </Typography>
                        <Typography>
                            Current Rain: {courtCondition.details.currentRain}mm/h
                        </Typography>
                        <Typography>
                            Recent Rain: {courtCondition.details.recentRain}mm
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}; 
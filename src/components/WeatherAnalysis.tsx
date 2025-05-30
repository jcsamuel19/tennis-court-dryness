import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Alert,
    CircularProgress,
    Button,
    Divider
} from '@mui/material';
import type { CourtCondition } from '../types/weather';
import { getHistoricalData } from '../services/weatherService';
import { determineCourtCondition } from '../utils/courtConditions';
import { PlayabilityGauge } from './PlayabilityGauge';

interface SearchLocation {
    query: string;
    searchType: 'city' | 'nearMe';
    coordinates?: { lat: number; lng: number };
}

interface WeatherAnalysisProps {
    location: SearchLocation;
    onBack: () => void;
}

export const WeatherAnalysis = ({ location, onBack }: WeatherAnalysisProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [courtCondition, setCourtCondition] = useState<CourtCondition | null>(null);

    const checkWeather = async () => {
        setLoading(true);
        setError(null);

        if (!import.meta.env.VITE_OPENWEATHER_API_KEY) {
            setError('OpenWeather API key is not configured.');
            setLoading(false);
            return;
        }

        if (!location.coordinates) {
            setError('No location coordinates available.');
            setLoading(false);
            return;
        }

        try {
            // Get weather data using coordinates
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${location.coordinates.lat}&lon=${location.coordinates.lng}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=imperial`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            
            const currentWeather = await response.json();
            const historicalData = await getHistoricalData(location.coordinates.lat, location.coordinates.lng);
            
            const condition = determineCourtCondition(currentWeather, historicalData);
            setCourtCondition(condition);
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to fetch weather data for this location.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkWeather();
    }, [location]);

    const getLocationDisplayName = () => {
        if (location.searchType === 'nearMe') {
            return 'Your Current Location';
        }
        return location.query;
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            {/* Location Header */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom>
                            🎾 Tennis Court Conditions
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            📍 {getLocationDisplayName()}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Weather Analysis */}
            <Card>
                <CardContent>
                    <Typography variant="h6" align="center" gutterBottom>
                        Court Playability Analysis
                    </Typography>

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                            <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
                                Checking weather conditions...
                            </Typography>
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                            <Button onClick={checkWeather} sx={{ ml: 2 }}>
                                Retry
                            </Button>
                        </Alert>
                    )}

                    {courtCondition && (
                        <>
                            {/* Playability Gauge */}
                            <Box sx={{ mb: 3 }}>
                                <PlayabilityGauge score={courtCondition.score} />
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Main Message */}
                            <Alert 
                                severity={
                                    courtCondition.score >= 60 ? "success" : 
                                    courtCondition.score >= 40 ? "warning" : "error"
                                }
                                sx={{ mb: 2 }}
                            >
                                {courtCondition.message}
                            </Alert>

                            {/* Drying Time */}
                            {!courtCondition.isDry && courtCondition.dryingTimeHours > 0 && (
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    ⏱️ <strong>Estimated drying time:</strong> {courtCondition.dryingTimeHours} hours
                                    {courtCondition.dryingTimeHours > 24 && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Consider checking weather forecast for better conditions
                                        </Typography>
                                    )}
                                </Alert>
                            )}
                            
                            {/* Weather Details */}
                            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                                Current Weather Details:
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 3 }}>
                                <Typography>
                                    🌡️ Temperature: {courtCondition.details.temperature}°F
                                </Typography>
                                <Typography>
                                    💧 Humidity: {courtCondition.details.humidity}%
                                </Typography>
                                <Typography>
                                    🌧️ Current Rain: {courtCondition.details.currentRain}mm/h
                                </Typography>
                                <Typography>
                                    ☔ Recent Rain: {courtCondition.details.recentRain}mm
                                </Typography>
                            </Box>

                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                <Button 
                                    variant="outlined" 
                                    onClick={checkWeather}
                                    disabled={loading}
                                >
                                    🔄 Refresh Weather
                                </Button>
                            </Box>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* New Search Button - Moved to Bottom */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button 
                    variant="contained" 
                    onClick={onBack}
                    size="large"
                >
                    ← New Search
                </Button>
            </Box>
        </Box>
    );
}; 
import { useState } from 'react';
import { Box, Button, Typography, Alert, TextField } from '@mui/material';

export const SimpleAPITest = () => {
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState('London');

    const testDirectAPI = async () => {
        setLoading(true);
        setResult('');

        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        
        if (!apiKey) {
            setResult('❌ No API key found');
            setLoading(false);
            return;
        }

        try {
            setResult('🔄 Testing direct API call...');
            
            // Direct fetch to OpenWeather API
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
            console.log('Making request to:', url.replace(apiKey, 'API_KEY_HIDDEN'));
            
            const response = await fetch(url);
            const data = await response.json();
            
            console.log('Response status:', response.status);
            console.log('Response data:', data);
            
            if (response.ok) {
                setResult(`✅ SUCCESS!
City: ${data.name}, ${data.sys.country}
Temperature: ${data.main.temp}°C
Feels like: ${data.main.feels_like}°C
Humidity: ${data.main.humidity}%
Description: ${data.weather[0].description}
Rain (1h): ${data.rain?.['1h'] || 0}mm
Status: ${response.status}

Raw coordinates: ${data.coord.lat}, ${data.coord.lon}`);
            } else {
                setResult(`❌ API Error (${response.status}):
${data.message || 'Unknown error'}

Common issues:
- Invalid API key
- City not found
- API key not activated (wait 10 minutes after signup)
- Rate limit exceeded`);
            }
        } catch (error) {
            console.error('Network error:', error);
            setResult(`❌ Network Error: ${error}

This usually means:
- No internet connection
- CORS issues (shouldn't happen with OpenWeather)
- API endpoint is down`);
        } finally {
            setLoading(false);
        }
    };

    const testAPIKeyFormat = () => {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        if (!apiKey) {
            setResult('❌ No API key in environment variables');
            return;
        }
        
        const isValidFormat = /^[a-f0-9]{32}$/.test(apiKey);
        setResult(`API Key Check:
Length: ${apiKey.length} (should be 32)
Format: ${isValidFormat ? '✅ Valid' : '❌ Invalid'} 
First 8 chars: ${apiKey.substring(0, 8)}...

${isValidFormat ? 'API key format looks correct!' : 'API key should be 32 hexadecimal characters'}`);
    };

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h5" gutterBottom>
                🔬 Simple API Test
            </Typography>
            
            <Box sx={{ mb: 3 }}>
                <TextField
                    label="City to test"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    sx={{ mr: 2, minWidth: 200 }}
                />
            </Box>
            
            <Box sx={{ mb: 3 }}>
                <Button 
                    variant="outlined" 
                    onClick={testAPIKeyFormat}
                    sx={{ mr: 2 }}
                >
                    Check API Key Format
                </Button>
                <Button 
                    variant="contained" 
                    onClick={testDirectAPI}
                    disabled={loading || !city}
                >
                    {loading ? 'Testing...' : 'Test API Call'}
                </Button>
            </Box>

            {result && (
                <Box sx={{ 
                    p: 2, 
                    bgcolor: result.includes('✅') ? 'success.light' : 
                             result.includes('❌') ? 'error.light' : 'info.light',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-line',
                    fontSize: '0.9rem'
                }}>
                    {result}
                </Box>
            )}
            
            <Alert severity="info" sx={{ mt: 3 }}>
                <strong>Debugging steps:</strong><br/>
                1. Check API key format first<br/>
                2. Test API call with a common city (London, New York)<br/>
                3. Check browser console (F12) for detailed errors<br/>
                4. Verify your API key is activated at openweathermap.org
            </Alert>
        </Box>
    );
}; 
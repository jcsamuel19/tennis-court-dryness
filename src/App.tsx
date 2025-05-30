import { useState } from 'react';
import { CssBaseline, Container, Box, CircularProgress, Alert } from '@mui/material';
import { CourtSearch } from './components/CourtSearch';
import { WeatherAnalysis } from './components/WeatherAnalysis';

type AppState = 'search' | 'weather';

interface SearchLocation {
  query: string;
  searchType: 'city' | 'nearMe';
  coordinates?: { lat: number; lng: number };
}

function App() {
  const [appState, setAppState] = useState<AppState>('search');
  const [searchLocation, setSearchLocation] = useState<SearchLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (criteria: { query: string; searchType: 'city' | 'nearMe' }) => {
    setLoading(true);
    setError(null);
    
    try {
      let coordinates: { lat: number; lng: number } | undefined;

      if (criteria.searchType === 'nearMe') {
        // Get current location
        coordinates = await getCurrentLocation();
      } else {
        // Get coordinates from city
        coordinates = await getCoordinatesFromLocation(criteria.query);
      }

      if (!coordinates) {
        if (criteria.searchType === 'nearMe') {
          throw new Error('Unable to access your location. Please try searching by city instead.');
        } else {
          throw new Error(`Could not find city "${criteria.query}". Please check the spelling and try again.`);
        }
      }

      setSearchLocation({
        query: criteria.query,
        searchType: criteria.searchType,
        coordinates
      });
      setAppState('weather');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSearch = () => {
    setAppState('search');
    setSearchLocation(null);
    setError(null);
  };

  // Get user's current location
  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  // Get coordinates for a location using a simple geocoding approach
  const getCoordinatesFromLocation = async (location: string): Promise<{ lat: number; lng: number } | undefined> => {
    try {
      // Simple approach - we'll use OpenWeather's geocoding API
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: data[0].lat,
          lng: data[0].lon
        };
      }
      return undefined;
    } catch (error) {
      console.error('Error geocoding location:', error);
      return undefined;
    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress />
              <Box sx={{ ml: 2 }}>Checking weather conditions...</Box>
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Search State */}
          {appState === 'search' && !loading && (
            <CourtSearch onSearch={handleSearch} loading={loading} />
          )}

          {/* Weather State */}
          {appState === 'weather' && searchLocation && !loading && (
            <WeatherAnalysis 
              location={searchLocation} 
              onBack={handleBackToSearch}
            />
          )}
        </Box>
      </Container>
    </>
  );
}

export default App;

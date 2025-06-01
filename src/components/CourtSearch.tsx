import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

interface CourtSearchProps {
    onSearch: (criteria: { query: string; searchType: 'city' | 'nearMe' }) => void;
    loading: boolean;
}

export const CourtSearch = ({ onSearch, loading }: CourtSearchProps) => {
    const [query, setQuery] = useState('');
    const [showLocationDialog, setShowLocationDialog] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (query.trim()) {
            // Always treat input as city search
            onSearch({ query: query.trim(), searchType: 'city' });
        }
    };

    const handleNearMeClick = () => {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser. Please try searching by city instead.');
            return;
        }
        setShowLocationDialog(true);
    };

    const handleLocationConfirm = () => {
        setShowLocationDialog(false);
        onSearch({ query: '', searchType: 'nearMe' });
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center',
            px: 2
        }}>
            {/* Logo Image */}
            <Box sx={{ mb: 3 }}>
                <img 
                    src="/puddle-withWords.png" 
                    alt="Puddle Check Logo" 
                    style={{ 
                        maxWidth: '300px', 
                        width: '100%', 
                        height: 'auto' 
                    }} 
                />
            </Box>

            <Typography variant="h4" align="center" gutterBottom>
                🎾 Tennis Court Puddle Check
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
                Check if courts are dry enough to play tennis
            </Typography>

            <form onSubmit={handleSubmit}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2, 
                    mb: 3,
                    maxWidth: 400,
                    width: '100%'
                }}>
                    <TextField
                        fullWidth
                        label="Enter city"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={loading}
                        placeholder="Enter city name (e.g., San Francisco, New York)"
                        required
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading || !query.trim()}
                            sx={{ flex: 1, py: 1.5 }}
                        >
                            {loading ? 'Checking...' : 'Check Courts'}
                        </Button>
                        
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={handleNearMeClick}
                            disabled={loading}
                            sx={{ py: 1.5, minWidth: 140 }}
                        >
                            📍 Near Me
                        </Button>
                    </Box>
                </Box>
            </form>

            {/* Location Permission Dialog */}
            <Dialog open={showLocationDialog} onClose={() => setShowLocationDialog(false)}>
                <DialogTitle>🌍 Location Access</DialogTitle>
                <DialogContent>
                    <Typography>
                        We need access to your location to check weather conditions near you. 
                        Your location data is only used for this weather check and is not stored.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowLocationDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleLocationConfirm} variant="contained">
                        Allow Location Access
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}; 
import { Box, Typography } from '@mui/material';

interface PlayabilityGaugeProps {
    score: number; // 0-100 where 0 is poor, 100 is perfect
    width?: number;
    height?: number;
}

export const PlayabilityGauge = ({ score, width = 400, height = 60 }: PlayabilityGaugeProps) => {
    // Clamp score between 0 and 100
    const clampedScore = Math.max(0, Math.min(100, score));
    
    // Calculate the fill percentage
    const fillPercentage = clampedScore;
    
    // Determine color based on score
    const getScoreColor = (score: number): string => {
        if (score >= 80) return '#44AA44'; // Green - Perfect
        if (score >= 60) return '#FFDD00'; // Yellow - Good  
        if (score >= 40) return '#FF8800'; // Orange - Fair
        return '#FF4444'; // Red - Poor
    };

    // Get label based on score
    const getScoreLabel = (score: number): string => {
        if (score >= 80) return 'Perfect';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Poor';
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%',
            maxWidth: width,
            mx: 'auto'
        }}>
            {/* Score Label */}
            <Typography 
                variant="h6" 
                sx={{ 
                    mb: 1,
                    color: getScoreColor(clampedScore),
                    fontWeight: 'bold'
                }}
            >
                {getScoreLabel(clampedScore)} ({clampedScore}/100)
            </Typography>

            {/* Horizontal Progress Bar */}
            <Box sx={{ 
                position: 'relative',
                width: '100%',
                height: height,
                borderRadius: height / 2,
                overflow: 'hidden',
                border: '2px solid #e0e0e0'
            }}>
                {/* Background gradient */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to right, #FF4444 0%, #FF8800 33%, #FFDD00 66%, #44AA44 100%)',
                    opacity: 0.3
                }} />

                {/* Score fill */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${fillPercentage}%`,
                    height: '100%',
                    background: getScoreColor(clampedScore),
                    transition: 'width 0.5s ease-in-out, background-color 0.3s ease'
                }} />

                {/* Score indicator (vertical line) */}
                <Box sx={{
                    position: 'absolute',
                    top: '-2px',
                    left: `${fillPercentage}%`,
                    transform: 'translateX(-50%)',
                    width: '4px',
                    height: `${height + 4}px`,
                    backgroundColor: '#333',
                    borderRadius: '2px'
                }} />
            </Box>

            {/* Scale labels */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                width: '100%',
                mt: 1,
                px: 1
            }}>
                <Typography variant="caption" color="text.secondary">
                    Poor (0)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Fair (40)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Good (60)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Perfect (100)
                </Typography>
            </Box>
        </Box>
    );
}; 
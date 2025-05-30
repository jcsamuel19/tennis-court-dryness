export interface WeatherData {
    main: {
        temp: number;
        humidity: number;
    };
    rain?: {
        '1h'?: number;
    };
    dt: number;
    coord: {
        lat: number;
        lon: number;
    };
}

export interface CourtCondition {
    isDry: boolean;
    message: string;
    score: number; // 0-100 playability score
    dryingTimeHours: number; // Estimated hours until courts are dry
    details: {
        temperature: number;
        humidity: number;
        currentRain: number;
        recentRain: number;
    };
} 
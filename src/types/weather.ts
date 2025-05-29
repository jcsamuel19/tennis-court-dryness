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
    details: {
        temperature: number;
        humidity: number;
        currentRain: number;
        recentRain: number;
    };
} 
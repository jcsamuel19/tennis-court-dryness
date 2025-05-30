# 🎾 Puddle Check - Tennis Court Weather App

A React application that helps tennis players find courts and check if they're dry enough to play based on weather conditions.

## ✨ Features

- **🔍 Court Search**: Find tennis courts by city, court name, zip code, or "near me"
- **🌦️ Weather Analysis**: Real-time weather conditions with playability scoring
- **📊 Visual Gauge**: Beautiful score gauge (0-100) showing court conditions
- **⏱️ Drying Time**: Estimates when courts will be dry enough to play
- **🗺️ Google Maps Integration**: Links to view courts on Google Maps

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud Platform account
- OpenWeatherMap account

### 2. Google Places API Setup

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Required APIs**:
   - Go to "APIs & Services" → "Library"
   - Enable the following APIs:
     - **Places API**
     - **Geocoding API**
     - **Maps JavaScript API** (for map links)

3. **Create API Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key

4. **Restrict API Key** (Recommended):
   - Click on your API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost:5173` for development)
   - Under "API restrictions", select "Restrict key" and choose the APIs you enabled

### 3. OpenWeatherMap API Setup

1. **Sign up**: Go to [OpenWeatherMap](https://openweathermap.org/api)
2. **Get API Key**: Sign up for a free account and get your API key
3. **Wait for activation**: API keys can take up to 10 minutes to activate

### 4. Environment Configuration

Create a `.env` file in the project root:

```env
# Google Places API Key
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# OpenWeatherMap API Key  
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### 5. Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 API Configuration

### Google Places API Pricing
- **Free tier**: 200,000 requests per month
- **Cost**: $17 per 1,000 requests after free tier
- **Our usage**: Each search uses 1-2 requests

### Rate Limiting
The app includes built-in rate limiting and error handling for both APIs.

## 🧪 Testing

### Test Search Queries
- **City**: "San Francisco", "New York", "London"
- **Court Name**: "Central Park Tennis", "Golden Gate Park"
- **Zip Code**: "94102", "10025", "90210"
- **Near Me**: Uses browser geolocation

### Common Issues

1. **"API key not configured"**:
   - Check your `.env` file exists and has the correct variable names
   - Restart the dev server after adding environment variables

2. **"Request denied" from Google Places**:
   - Verify your API key is correct
   - Check that Places API is enabled in Google Cloud Console
   - Ensure API key restrictions allow your domain

3. **No courts found**:
   - Try broader search terms
   - Check your location services are enabled for "Near Me"
   - Verify the search location exists

4. **Weather data fails**:
   - Check OpenWeatherMap API key is correct and activated
   - Ensure you haven't exceeded rate limits

## 🏗️ Architecture

```
src/
├── components/
│   ├── CourtSearch.tsx      # Search interface
│   ├── CourtList.tsx        # Display found courts
│   ├── CourtWeather.tsx     # Weather analysis
│   └── PlayabilityGauge.tsx # Visual score gauge
├── services/
│   ├── courtService.ts      # Google Places API integration
│   └── weatherService.ts    # OpenWeatherMap API integration
├── types/
│   ├── court.ts            # Court data types
│   └── weather.ts          # Weather data types
└── utils/
    └── courtConditions.ts   # Weather scoring algorithm
```

## 📱 User Flow

1. **Search** → User searches for tennis courts
2. **Browse** → App displays found courts with ratings
3. **Select** → User picks a specific court
4. **Analyze** → App shows weather conditions and playability score
5. **Decision** → User sees if courts are ready to play

## 🎯 Scoring Algorithm

The playability score (0-100) considers:
- **Temperature**: Freezing = 0, optimal = bonus points
- **Current rain**: Heavy penalty for active precipitation  
- **Recent rain**: Moderate penalty for recent rainfall
- **Humidity**: High humidity reduces score
- **Drying factors**: Heat and low humidity improve drying time

## 📄 License

MIT License - feel free to use this project for your own tennis adventures!

---

Made with ❤️ for tennis players who hate wet courts! 🎾

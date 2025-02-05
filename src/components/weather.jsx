import { Cloud, Sun, CloudRain, CloudLightning, Snowflake } from 'lucide-react';

export const WeatherDisplay = ({ weatherData }) => {
  if (!weatherData) return <div>No weather data available</div>;

  const { main, weather, wind, clouds } = weatherData;
  const weatherDetails = weather[0];

  const WeatherIcon = ({ weatherId }) => {
    if (weatherId >= 200 && weatherId < 300) {
      return <CloudLightning className="w-8 h-8 text-yellow-500" />;
    }
    if (weatherId >= 300 && weatherId < 500) {
      return <CloudRain className="w-8 h-8 text-blue-300" />;
    }
    if (weatherId >= 500 && weatherId < 600) {
      return <CloudRain className="w-8 h-8 text-blue-400" />;
    }
    if (weatherId >= 600 && weatherId < 700) {
      return <Snowflake className="w-8 h-8 text-gray-300" />;
    }
    if (weatherId === 800) {
      return <Sun className="w-8 h-8 text-yellow-400" />;
    }
    if (weatherId > 800) {
      return <Cloud className="w-8 h-8 text-gray-400" />;
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center mb-4">
        <WeatherIcon weatherId={weatherDetails.id} />
        <span className="ml-4 text-xl font-bold">
          {weatherDetails.description.replace(/\b\w/g, l => l.toUpperCase())}, {main.temp.toFixed(1)}°C
        </span>
      </div>
      <div className="text-sm text-gray-600">
        Feels like: {main.feels_like.toFixed(1)}°C | Humidity: {main.humidity}% | Wind: {wind.speed.toFixed(1)} m/s
      </div>
      <div className="text-sm text-gray-600">
        Pressure: {main.pressure} hPa | Cloud cover: {clouds.all}%
      </div>
    </div>
  );
};
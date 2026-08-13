import type { WeatherCondition } from './types'

export const WEATHER_FACTORS: Record<WeatherCondition, number> = {
  sunny: 1,
  cloudy: 0.6,
  overcast: 0.25,
  rain: 0.15,
}

export function getWeatherFactor(weather: WeatherCondition): number {
  return WEATHER_FACTORS[weather]
}


export type WeatherCondition = 'sunny' | 'cloudy' | 'overcast' | 'rain'

export type SolarSimulationInput = {
  /**
   * Public input uses degrees.
   * tilt: 0 = flat/horizontal, 90 = vertical.
   * azimuth: 0 = north, 90 = east, 180 = south, 270 = west.
   */
  panel: {
    tilt: number
    azimuth: number
    count: number
    nominalPowerWatts: number
  }
  /**
   * timeHour is a decimal hour in local solar-time-like terms.
   * Example: 13.5 means 13:30.
   */
  environment: {
    timeHour: number
    weather: WeatherCondition
  }
}

export type SunPosition = {
  azimuth: number
  elevation: number
  isDaylight: boolean
}

export type SolarSimulationResult = {
  sun: SunPosition
  alignment: number
  weatherFactor: number
  maxArrayPowerWatts: number
  estimatedPowerWatts: number
  potentialPercent: number
  panelAreaSquareMeters: number
  totalPanelAreaSquareMeters: number
}

export type Vector3 = {
  x: number
  y: number
  z: number
}


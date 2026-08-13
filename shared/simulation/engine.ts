import { getSunPosition } from './sun'
import { getWeatherFactor } from './weather'
import { getPanelSunAlignment } from './solar'
import { solarSimulationInputSchema } from './validation'
import type { SolarSimulationInput, SolarSimulationResult } from './types'

const DEMO_PANEL_WIDTH_METERS = 1.72
const DEMO_PANEL_HEIGHT_METERS = 1.13
const DEMO_PANEL_AREA_SQUARE_METERS = DEMO_PANEL_WIDTH_METERS * DEMO_PANEL_HEIGHT_METERS

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function simulateSolarConfiguration(input: SolarSimulationInput): SolarSimulationResult
export function simulateSolarConfiguration(input: unknown): SolarSimulationResult
export function simulateSolarConfiguration(input: unknown): SolarSimulationResult {
  const parsed = solarSimulationInputSchema.parse(input)

  const sun = getSunPosition(parsed.environment.timeHour)
  const weatherFactor = getWeatherFactor(parsed.environment.weather)
  const alignment = sun.isDaylight
    ? getPanelSunAlignment(parsed.panel.tilt, parsed.panel.azimuth, sun.azimuth, sun.elevation)
    : 0

  const maxArrayPowerWatts = parsed.panel.nominalPowerWatts * parsed.panel.count
  const estimatedPowerWatts = sun.isDaylight ? maxArrayPowerWatts * alignment * weatherFactor : 0
  const potentialPercent = maxArrayPowerWatts > 0 ? clamp((estimatedPowerWatts / maxArrayPowerWatts) * 100, 0, 100) : 0
  const totalPanelAreaSquareMeters = DEMO_PANEL_AREA_SQUARE_METERS * parsed.panel.count

  return {
    sun,
    alignment,
    weatherFactor,
    maxArrayPowerWatts,
    estimatedPowerWatts,
    potentialPercent,
    panelAreaSquareMeters: DEMO_PANEL_AREA_SQUARE_METERS,
    totalPanelAreaSquareMeters,
  }
}


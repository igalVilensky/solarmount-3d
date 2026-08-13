import type { SunPosition } from './types'

const DAYLIGHT_START_HOUR = 6
const DAYLIGHT_END_HOUR = 18
const HALF_DAY_HOURS = (DAYLIGHT_END_HOUR - DAYLIGHT_START_HOUR) / 2
const MAX_ELEVATION_DEGREES = 65

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

/**
 * Simplified, deterministic sun model for an interview prototype.
 * The azimuth sweeps east -> south -> west during a 06:00-18:00 daylight window.
 * The elevation follows a smooth sine arc and does not account for date, season, or location.
 */
export function getSunPosition(timeHour: number): SunPosition {
  const isDaylight = timeHour >= DAYLIGHT_START_HOUR && timeHour <= DAYLIGHT_END_HOUR

  if (!isDaylight) {
    return {
      azimuth: timeHour < DAYLIGHT_START_HOUR ? 90 : 270,
      elevation: 0,
      isDaylight: false,
    }
  }

  const daylightProgress = clamp((timeHour - DAYLIGHT_START_HOUR) / (DAYLIGHT_END_HOUR - DAYLIGHT_START_HOUR), 0, 1)
  const sunriseToNoonProgress = clamp((timeHour - DAYLIGHT_START_HOUR) / HALF_DAY_HOURS, 0, 1)
  const noonToSunsetProgress = clamp((timeHour - (DAYLIGHT_START_HOUR + HALF_DAY_HOURS)) / HALF_DAY_HOURS, 0, 1)

  const azimuth =
    timeHour <= DAYLIGHT_START_HOUR + HALF_DAY_HOURS
      ? lerp(90, 180, sunriseToNoonProgress)
      : lerp(180, 270, noonToSunsetProgress)

  const elevation = Math.sin(Math.PI * daylightProgress) * MAX_ELEVATION_DEGREES

  return {
    azimuth,
    elevation,
    isDaylight: true,
  }
}


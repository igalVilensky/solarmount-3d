const COMPASS_DIRECTIONS = ['Nord', 'Nordost', 'Ost', 'Südost', 'Süd', 'Südwest', 'West', 'Nordwest'] as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function formatCompassDirection(azimuthDegrees: number): string {
  const normalized = ((azimuthDegrees % 360) + 360) % 360
  const index = Math.round(normalized / 45) % COMPASS_DIRECTIONS.length

  return COMPASS_DIRECTIONS[index]
}

export function formatClockTime(decimalHour: number): string {
  const normalizedHour = clamp(decimalHour, 0, 24)
  let hours = Math.floor(normalizedHour)
  let minutes = Math.round((normalizedHour - hours) * 60)

  if (minutes === 60) {
    hours += 1
    minutes = 0
  }

  if (hours > 24) {
    hours = 24
  }

  return `${pad(hours)}:${pad(minutes)}`
}

export function formatWatts(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} kW`
  }

  return `${Math.round(value)} W`
}

export function formatSquareMeters(value: number): string {
  return `${value.toFixed(2)} m²`
}

export function formatPercent(value: number): string {
  return `${Math.round(value)} %`
}

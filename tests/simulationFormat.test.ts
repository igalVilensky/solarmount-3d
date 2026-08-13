import { describe, expect, it } from 'vitest'
import { formatClockTime, formatCompassDirection, formatWatts } from '../app/utils/simulationFormat'

describe('simulation formatting helpers', () => {
  it('formats the four main compass directions', () => {
    expect(formatCompassDirection(0)).toBe('Nord')
    expect(formatCompassDirection(90)).toBe('Ost')
    expect(formatCompassDirection(180)).toBe('Süd')
    expect(formatCompassDirection(270)).toBe('West')
  })

  it('formats intermediate directions', () => {
    expect(formatCompassDirection(45)).toBe('Nordost')
    expect(formatCompassDirection(135)).toBe('Südost')
    expect(formatCompassDirection(225)).toBe('Südwest')
    expect(formatCompassDirection(315)).toBe('Nordwest')
  })

  it('formats decimal hours as clock time', () => {
    expect(formatClockTime(13.5)).toBe('13:30')
    expect(formatClockTime(6.25)).toBe('06:15')
  })

  it('formats watts and kilowatts', () => {
    expect(formatWatts(382)).toBe('382 W')
    expect(formatWatts(2310)).toBe('2.31 kW')
  })
})

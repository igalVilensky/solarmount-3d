import { describe, expect, it } from 'vitest'
import {
  getPanelSunAlignment,
  getSunPosition,
  getWeatherFactor,
  simulateSolarConfiguration,
  solarSimulationInputSchema,
} from '../shared/simulation'

const validInput = {
  panel: {
    tilt: 30,
    azimuth: 180,
    count: 4,
    nominalPowerWatts: 420,
  },
  environment: {
    timeHour: 12,
    weather: 'sunny',
  },
} as const

describe('validation', () => {
  it('accepts valid input', () => {
    const result = solarSimulationInputSchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects tilt below 0', () => {
    const result = solarSimulationInputSchema.safeParse({
      ...validInput,
      panel: { ...validInput.panel, tilt: -1 },
    })

    expect(result.success).toBe(false)
  })

  it('rejects tilt above 90', () => {
    const result = solarSimulationInputSchema.safeParse({
      ...validInput,
      panel: { ...validInput.panel, tilt: 91 },
    })

    expect(result.success).toBe(false)
  })

  it('rejects unsupported weather', () => {
    const result = solarSimulationInputSchema.safeParse({
      ...validInput,
      environment: { ...validInput.environment, weather: 'foggy' },
    })

    expect(result.success).toBe(false)
  })

  it('rejects panel count 0', () => {
    const result = solarSimulationInputSchema.safeParse({
      ...validInput,
      panel: { ...validInput.panel, count: 0 },
    })

    expect(result.success).toBe(false)
  })
})

describe('sun model', () => {
  it('midday produces daylight', () => {
    expect(getSunPosition(12).isDaylight).toBe(true)
  })

  it('midnight produces no daylight', () => {
    expect(getSunPosition(0).isDaylight).toBe(false)
  })

  it('morning sun is roughly east', () => {
    const sun = getSunPosition(8)

    expect(sun.azimuth).toBeGreaterThanOrEqual(85)
    expect(sun.azimuth).toBeLessThan(150)
  })

  it('midday sun is roughly south', () => {
    const sun = getSunPosition(12)

    expect(sun.azimuth).toBeGreaterThanOrEqual(170)
    expect(sun.azimuth).toBeLessThanOrEqual(190)
  })

  it('evening sun is roughly west', () => {
    const sun = getSunPosition(16)

    expect(sun.azimuth).toBeGreaterThan(210)
    expect(sun.azimuth).toBeLessThanOrEqual(275)
  })
})

describe('alignment', () => {
  it('is high when the panel roughly faces the sun', () => {
    const alignment = getPanelSunAlignment(35, 180, 180, 55)

    expect(alignment).toBeGreaterThan(0.7)
  })

  it('is low when the panel faces away from the sun', () => {
    const alignment = getPanelSunAlignment(90, 0, 180, 55)

    expect(alignment).toBeLessThan(0.1)
  })

  it('always stays within 0..1', () => {
    const alignment = getPanelSunAlignment(90, 270, 90, 0)

    expect(alignment).toBeGreaterThanOrEqual(0)
    expect(alignment).toBeLessThanOrEqual(1)
  })
})

describe('weather', () => {
  it('orders factors from sunny to rain', () => {
    expect(getWeatherFactor('sunny')).toBeGreaterThan(getWeatherFactor('cloudy'))
    expect(getWeatherFactor('cloudy')).toBeGreaterThan(getWeatherFactor('overcast'))
    expect(getWeatherFactor('overcast')).toBeGreaterThan(getWeatherFactor('rain'))
  })
})

describe('power', () => {
  it('returns zero at night', () => {
    const result = simulateSolarConfiguration({
      ...validInput,
      environment: { ...validInput.environment, timeHour: 0 },
    })

    expect(result.estimatedPowerWatts).toBe(0)
    expect(result.potentialPercent).toBe(0)
  })

  it('scales with panel count', () => {
    const onePanel = simulateSolarConfiguration({
      ...validInput,
      panel: { ...validInput.panel, count: 1 },
    })
    const fourPanels = simulateSolarConfiguration(validInput)

    expect(fourPanels.estimatedPowerWatts).toBeGreaterThan(onePanel.estimatedPowerWatts)
    expect(fourPanels.maxArrayPowerWatts).toBe(onePanel.maxArrayPowerWatts * 4)
  })

  it('gives more power to a better aligned panel', () => {
    const aligned = simulateSolarConfiguration({
      ...validInput,
      panel: { ...validInput.panel, azimuth: 180 },
    })
    const misaligned = simulateSolarConfiguration({
      ...validInput,
      panel: { ...validInput.panel, azimuth: 0 },
    })

    expect(aligned.estimatedPowerWatts).toBeGreaterThan(misaligned.estimatedPowerWatts)
  })

  it('keeps potential percent within bounds', () => {
    const result = simulateSolarConfiguration(validInput)

    expect(result.potentialPercent).toBeGreaterThanOrEqual(0)
    expect(result.potentialPercent).toBeLessThanOrEqual(100)
  })
})

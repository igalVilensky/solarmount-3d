import { createApp, toWebHandler } from 'h3'
import { describe, expect, it } from 'vitest'
import simulationHandler from '../server/api/simulation.post'

const handler = toWebHandler(createApp().use('/api/simulation', simulationHandler))

async function postSimulation(body: unknown) {
  return handler(
    new Request('http://localhost/api/simulation', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  )
}

describe('POST /api/simulation', () => {
  it('returns a simulation result for valid input', async () => {
    const response = await postSimulation({
      panel: {
        tilt: 30,
        azimuth: 180,
        count: 6,
        nominalPowerWatts: 430,
      },
      environment: {
        timeHour: 13,
        weather: 'sunny',
      },
    })

    expect(response.status).toBe(200)

    const body = await response.json()

    expect(body).toHaveProperty('result')
    expect(body.result).toMatchObject({
      sun: {
        isDaylight: true,
      },
    })
    expect(body.result.estimatedPowerWatts).toBeGreaterThan(0)
    expect(body.result.potentialPercent).toBeGreaterThanOrEqual(0)
    expect(body.result.potentialPercent).toBeLessThanOrEqual(100)
  })

  it('returns a structured 400 response for invalid tilt', async () => {
    const response = await postSimulation({
      panel: {
        tilt: 120,
        azimuth: 180,
        count: 6,
        nominalPowerWatts: 430,
      },
      environment: {
        timeHour: 13,
        weather: 'sunny',
      },
    })

    expect(response.status).toBe(400)

    const body = await response.json()

    expect(body).toMatchObject({
      error: 'INVALID_SIMULATION_INPUT',
      message: 'The simulation input is invalid.',
    })
    expect(Array.isArray(body.details)).toBe(true)
    expect(body.details.length).toBeGreaterThan(0)
  })

  it('returns a structured 400 response for unsupported weather', async () => {
    const response = await postSimulation({
      panel: {
        tilt: 30,
        azimuth: 180,
        count: 6,
        nominalPowerWatts: 430,
      },
      environment: {
        timeHour: 13,
        weather: 'foggy',
      },
    })

    expect(response.status).toBe(400)

    const body = await response.json()

    expect(body.error).toBe('INVALID_SIMULATION_INPUT')
    expect(body.details.length).toBeGreaterThan(0)
  })

  it('returns zero estimated power at night', async () => {
    const response = await postSimulation({
      panel: {
        tilt: 30,
        azimuth: 180,
        count: 6,
        nominalPowerWatts: 430,
      },
      environment: {
        timeHour: 0,
        weather: 'sunny',
      },
    })

    expect(response.status).toBe(200)

    const body = await response.json()

    expect(body.result.estimatedPowerWatts).toBe(0)
    expect(body.result.potentialPercent).toBe(0)
  })

  it('returns a structured 400 response for malformed JSON', async () => {
    const response = await postSimulation('{"panel":')

    expect(response.status).toBe(400)

    const body = await response.json()

    expect(body.error).toBe('INVALID_SIMULATION_INPUT')
    expect(body.details[0]).toMatchObject({
      path: 'body',
      code: 'invalid_json',
    })
  })
})

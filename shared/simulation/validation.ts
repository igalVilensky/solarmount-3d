import { z } from 'zod'

export const weatherConditionSchema = z.enum(['sunny', 'cloudy', 'overcast', 'rain'])

export const solarPanelSchema = z.object({
  tilt: z.number().min(0).max(90),
  azimuth: z.number().min(0).max(360),
  count: z.number().int().min(1).max(100),
  nominalPowerWatts: z.number().positive().max(10000),
})

export const solarEnvironmentSchema = z.object({
  timeHour: z.number().min(0).max(24),
  weather: weatherConditionSchema,
})

export const solarSimulationInputSchema = z.object({
  panel: solarPanelSchema,
  environment: solarEnvironmentSchema,
})

export type SolarSimulationInputSchema = z.infer<typeof solarSimulationInputSchema>


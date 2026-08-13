import type { SolarSimulationInput, SolarSimulationResult } from '../simulation'

export type SimulationApiRequest = SolarSimulationInput

export type SimulationApiResponse = {
  result: SolarSimulationResult
}

export type SimulationApiValidationDetail = {
  path: string
  message: string
  code: string
}

export type SimulationApiErrorResponse = {
  error: 'INVALID_SIMULATION_INPUT'
  message: string
  details: SimulationApiValidationDetail[]
}

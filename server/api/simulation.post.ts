import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import type { ZodIssue } from 'zod'
import { simulateSolarConfiguration, solarSimulationInputSchema } from '~~/shared/simulation'
import type {
  SimulationApiErrorResponse,
  SimulationApiResponse,
  SimulationApiValidationDetail,
} from '~~/shared/api/simulation'

function formatValidationIssues(issues: ZodIssue[]): SimulationApiValidationDetail[] {
  return issues.slice(0, 5).map((issue) => ({
    path: issue.path.length > 0 ? issue.path.join('.') : 'body',
    message: issue.message,
    code: issue.code,
  }))
}

function invalidSimulationInput(event: Parameters<typeof setResponseStatus>[0], details: SimulationApiValidationDetail[]): SimulationApiErrorResponse {
  setResponseStatus(event, 400)

  return {
    error: 'INVALID_SIMULATION_INPUT',
    message: 'The simulation input is invalid.',
    details,
  }
}

export default defineEventHandler(async (event): Promise<SimulationApiResponse | SimulationApiErrorResponse> => {
  let body: unknown

  try {
    body = await readBody(event)
  } catch {
    return invalidSimulationInput(event, [
      {
        path: 'body',
        message: 'Request body must be valid JSON.',
        code: 'invalid_json',
      },
    ])
  }

  const parsed = solarSimulationInputSchema.safeParse(body)

  if (!parsed.success) {
    return invalidSimulationInput(event, formatValidationIssues(parsed.error.issues))
  }

  return {
    result: simulateSolarConfiguration(parsed.data),
  }
})

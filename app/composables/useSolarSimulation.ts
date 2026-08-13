import { onScopeDispose, ref, watch } from 'vue'
import type { SimulationApiRequest, SimulationApiResponse } from '~~/shared/api/simulation'
import type { SolarSimulationResult, WeatherCondition } from '~~/shared/simulation'

const DEFAULT_TILT = 30
const DEFAULT_AZIMUTH = 180
const DEFAULT_PANEL_COUNT = 6
const DEFAULT_NOMINAL_POWER_WATTS = 430
const DEFAULT_TIME_HOUR = 12
const DEFAULT_WEATHER: WeatherCondition = 'sunny'
const DEBOUNCE_DELAY_MS = 220

function createSimulationRequest(
  tilt: number,
  azimuth: number,
  panelCount: number,
  nominalPowerWatts: number,
  timeHour: number,
  weather: WeatherCondition,
): SimulationApiRequest {
  return {
    panel: {
      tilt,
      azimuth,
      count: panelCount,
      nominalPowerWatts,
    },
    environment: {
      timeHour,
      weather,
    },
  }
}

function getFriendlySimulationError(cause: unknown): string {
  if (typeof cause === 'object' && cause !== null) {
    const maybeFetchError = cause as {
      statusCode?: number
      status?: number
      data?: { error?: string; message?: string }
    }

    if ((maybeFetchError.statusCode === 400 || maybeFetchError.status === 400) && maybeFetchError.data?.error === 'INVALID_SIMULATION_INPUT') {
      return 'Simulation konnte wegen ungültiger Eingaben nicht aktualisiert werden.'
    }
  }

  return 'Simulation konnte nicht aktualisiert werden.'
}

export function useSolarSimulation() {
  const tilt = ref(DEFAULT_TILT)
  const azimuth = ref(DEFAULT_AZIMUTH)
  const panelCount = ref(DEFAULT_PANEL_COUNT)
  const nominalPowerWatts = ref(DEFAULT_NOMINAL_POWER_WATTS)
  const timeHour = ref(DEFAULT_TIME_HOUR)
  const weather = ref<WeatherCondition>(DEFAULT_WEATHER)
  const result = ref<SolarSimulationResult | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let requestSequence = 0
  let started = false
  const stopHandles: Array<() => void> = []

  onScopeDispose(() => {
    clearDebounceTimer()
    stopHandles.splice(0).forEach((stop) => stop())
  })

  function clearDebounceTimer() {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  }

  async function runSimulation() {
    const sequence = ++requestSequence
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<SimulationApiResponse>('/api/simulation', {
        method: 'POST',
        body: createSimulationRequest(
          tilt.value,
          azimuth.value,
          panelCount.value,
          nominalPowerWatts.value,
          timeHour.value,
          weather.value,
        ),
      })

      if (sequence !== requestSequence) {
        return
      }

      result.value = response.result
    } catch (cause) {
      if (sequence !== requestSequence) {
        return
      }

      error.value = getFriendlySimulationError(cause)
    } finally {
      if (sequence === requestSequence) {
        isLoading.value = false
      }
    }
  }

  function scheduleSimulation(options: { immediate?: boolean } = {}) {
    clearDebounceTimer()

    if (options.immediate) {
      void runSimulation()
      return
    }

    debounceTimer = setTimeout(() => {
      debounceTimer = null
      void runSimulation()
    }, DEBOUNCE_DELAY_MS)
  }

  function setWeather(nextWeather: WeatherCondition) {
    weather.value = nextWeather
  }

  function startAutoSimulation() {
    if (started) {
      return
    }

    started = true

    stopHandles.push(
      watch([tilt, azimuth, timeHour], () => scheduleSimulation(), { flush: 'post' }),
      watch([panelCount, nominalPowerWatts], () => scheduleSimulation({ immediate: true }), { flush: 'post' }),
      watch(weather, () => scheduleSimulation({ immediate: true }), { flush: 'post' }),
    )

    void runSimulation()
  }

  return {
    tilt,
    azimuth,
    panelCount,
    nominalPowerWatts,
    timeHour,
    weather,
    result,
    isLoading,
    error,
    runSimulation,
    scheduleSimulation,
    setWeather,
    startAutoSimulation,
  }
}

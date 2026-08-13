<script setup lang="ts">
import {
  formatClockTime,
  formatCompassDirection,
  formatPercent,
  formatSquareMeters,
  formatWatts,
} from '~/utils/simulationFormat'
import type { SolarSimulationResult } from '~~/shared/simulation'

defineProps<{
  result: SolarSimulationResult | null
  isLoading: boolean
  error: string | null
  tilt: number
  azimuth: number
  timeHour: number
  panelCount: number
}>()

function formatPanelArea(value: number | undefined): string {
  if (typeof value !== 'number') {
    return '—'
  }

  return formatSquareMeters(value)
}
</script>

<template>
  <section class="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-6">
    <div class="flex items-start justify-between gap-4">
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.32em] text-sky-300/80">
          Ergebnis
        </p>
        <h2 class="text-2xl font-semibold text-white">
          Simulation Results
        </h2>
      </div>

      <div
        class="rounded-full border px-3 py-1 text-xs font-medium tracking-[0.18em]"
        :class="isLoading ? 'border-sky-300/30 bg-sky-400/10 text-sky-200' : 'border-white/10 bg-slate-950/40 text-slate-300'"
      >
        {{ isLoading ? 'Simulation wird aktualisiert …' : 'Bereit' }}
      </div>
    </div>

    <p
      v-if="error"
      class="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
    >
      {{ error }}
    </p>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <article class="result-card">
        <span class="result-label">Aktuelle Leistung</span>
        <strong class="result-value">{{ result ? formatWatts(result.estimatedPowerWatts) : '—' }}</strong>
      </article>

      <article class="result-card">
        <span class="result-label">Aktuelles Potenzial</span>
        <strong class="result-value">{{ result ? formatPercent(result.potentialPercent) : '—' }}</strong>
      </article>

      <article class="result-card">
        <span class="result-label">Wetterfaktor</span>
        <strong class="result-value">{{ result ? formatPercent(result.weatherFactor * 100) : '—' }}</strong>
      </article>

      <article class="result-card">
        <span class="result-label">Ausrichtung</span>
        <strong class="result-value">
          {{ Math.round(azimuth) }}° · {{ formatCompassDirection(azimuth) }}
        </strong>
      </article>

      <article class="result-card">
        <span class="result-label">Neigung</span>
        <strong class="result-value">{{ Math.round(tilt) }}°</strong>
      </article>

      <article class="result-card">
        <span class="result-label">Tageszeit</span>
        <strong class="result-value">{{ formatClockTime(timeHour) }}</strong>
      </article>

      <article class="result-card">
        <span class="result-label">Sonnenstand</span>
        <strong class="result-value">
          {{ result ? `Azimut ${Math.round(result.sun.azimuth)}° · Höhe ${Math.round(result.sun.elevation)}°` : '—' }}
        </strong>
      </article>

      <article class="result-card">
        <span class="result-label">Modulfläche</span>
        <strong class="result-value">
          {{ result ? `${panelCount} Module · ${formatPanelArea(result.totalPanelAreaSquareMeters)}` : '—' }}
        </strong>
      </article>
    </div>

    <p class="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm leading-6 text-slate-300">
      Vereinfachtes Simulationsmodell – keine technische Auslegung oder Ertragsprognose.
    </p>
  </section>
</template>

<style scoped>
.result-card {
  @apply rounded-2xl border border-white/10 bg-slate-950/35 p-4;
}

.result-label {
  @apply block text-xs uppercase tracking-[0.26em] text-slate-400;
}

.result-value {
  @apply mt-2 block text-base font-semibold text-white;
}
</style>

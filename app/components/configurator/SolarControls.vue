<script setup lang="ts">
import { formatClockTime, formatCompassDirection } from '~/utils/simulationFormat'
import type { WeatherCondition } from '~~/shared/simulation'

defineProps<{
  tilt: number
  azimuth: number
  timeHour: number
  weather: WeatherCondition
  panelCount: number
  nominalPowerWatts: number
}>()

const emit = defineEmits<{
  (event: 'update:tilt', value: number): void
  (event: 'update:azimuth', value: number): void
  (event: 'update:timeHour', value: number): void
  (event: 'update:panelCount', value: number): void
  (event: 'weather-change', value: WeatherCondition): void
}>()

const weatherOptions: Array<{ value: WeatherCondition; label: string }> = [
  { value: 'sunny', label: 'Sonnig' },
  { value: 'cloudy', label: 'Bewölkt' },
  { value: 'overcast', label: 'Bedeckt' },
  { value: 'rain', label: 'Regen' },
]

const panelCountOptions = Array.from({ length: 12 }, (_, index) => index + 1)
</script>

<template>
  <section class="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-6">
    <div class="space-y-2">
      <p class="text-xs font-semibold uppercase tracking-[0.32em] text-sky-300/80">
        Konfiguration
      </p>
      <h2 class="text-2xl font-semibold text-white">
        Solar Controls
      </h2>
    </div>

    <div class="space-y-5">
      <label class="block space-y-3">
        <div class="flex items-center justify-between gap-4 text-sm">
          <span class="font-medium text-slate-200">Neigung</span>
          <span class="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-slate-100">
            {{ Math.round(tilt) }}°
          </span>
        </div>
        <input
          :value="tilt"
          class="solar-range"
          max="90"
          min="0"
          step="1"
          type="range"
          @input="emit('update:tilt', Number(($event.target as HTMLInputElement).value))"
        >
      </label>

      <label class="block space-y-3">
        <div class="flex items-center justify-between gap-4 text-sm">
          <span class="font-medium text-slate-200">Ausrichtung</span>
          <span class="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-slate-100">
            {{ Math.round(azimuth) }}° · {{ formatCompassDirection(azimuth) }}
          </span>
        </div>
        <input
          :value="azimuth"
          class="solar-range"
          max="360"
          min="0"
          step="1"
          type="range"
          @input="emit('update:azimuth', Number(($event.target as HTMLInputElement).value))"
        >
      </label>

      <label class="block space-y-3">
        <div class="flex items-center justify-between gap-4 text-sm">
          <span class="font-medium text-slate-200">Tageszeit</span>
          <span class="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-slate-100">
            {{ formatClockTime(timeHour) }}
          </span>
        </div>
        <input
          :value="timeHour"
          class="solar-range"
          max="18"
          min="6"
          step="0.25"
          type="range"
          @input="emit('update:timeHour', Number(($event.target as HTMLInputElement).value))"
        >
      </label>

      <div class="space-y-3">
        <div class="flex items-center justify-between gap-4 text-sm">
          <span class="font-medium text-slate-200">Wetter</span>
          <span class="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-slate-100">
            Simulationsfaktor
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            v-for="option in weatherOptions"
            :key="option.value"
            class="rounded-2xl border px-3 py-3 text-sm font-medium transition"
            :class="option.value === weather
              ? 'border-sky-300/70 bg-sky-400/20 text-white shadow-lg shadow-sky-950/20'
              : 'border-white/10 bg-slate-950/30 text-slate-300 hover:border-white/20 hover:bg-white/5'"
            type="button"
            @click="emit('weather-change', option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <label class="block space-y-3">
        <div class="flex items-center justify-between gap-4 text-sm">
          <span class="font-medium text-slate-200">Panel-Anzahl</span>
          <span class="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-slate-100">
            {{ panelCount }} Module
          </span>
        </div>
        <select
          :value="panelCount"
          class="solar-select"
          @change="emit('update:panelCount', Number(($event.target as HTMLSelectElement).value))"
        >
          <option v-for="option in panelCountOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>

      <div class="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
        <div class="flex items-center justify-between gap-3 text-sm">
          <span class="text-slate-300">Nominale Modulleistung</span>
          <span class="font-medium text-white">{{ nominalPowerWatts }} W</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.solar-range,
.solar-select {
  width: 100%;
  accent-color: #38bdf8;
}

.solar-range {
  height: 0.5rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgba(14, 165, 233, 0.24), rgba(148, 163, 184, 0.18));
}

.solar-select {
  appearance: none;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(2, 6, 23, 0.55);
  color: #f8fafc;
  padding: 0.875rem 1rem;
}
</style>

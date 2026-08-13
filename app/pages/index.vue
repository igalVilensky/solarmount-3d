<script setup lang="ts">
import { onMounted } from 'vue'
import SolarControls from '~/components/configurator/SolarControls.vue'
import SimulationResults from '~/components/configurator/SimulationResults.vue'
import SolarScene from '~/components/three/SolarScene.vue'
import { useSolarSimulation } from '~/composables/useSolarSimulation'

const simulation = useSolarSimulation()
const {
  tilt,
  azimuth,
  panelCount,
  nominalPowerWatts,
  timeHour,
  weather,
  result,
  isLoading,
  error,
  setWeather,
  startAutoSimulation,
} = simulation

onMounted(() => {
  startAutoSimulation()
})

useSeoMeta({
  title: 'SolarMount 3D',
  description: 'Interaktive Simulation einer Solarmodul-Konfiguration',
})
</script>

<template>
  <main class="relative min-h-dvh overflow-hidden bg-slate-950 text-slate-100">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.18),_transparent_36%)]" />
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />

    <div class="relative mx-auto min-h-dvh max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
      <section class="space-y-6">
        <div class="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.55fr)] lg:items-start">
          <div class="space-y-6">
            <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-8">
              <p class="text-sm font-medium uppercase tracking-[0.35em] text-sky-300/80">
                Interview Prototype
              </p>

              <div class="mt-4 space-y-4">
                <h1 class="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                  SolarMount 3D
                </h1>

                <p class="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                  Interaktive Solarmodul-Simulation mit direkter Kopplung an API, Ergebnisansicht und Three.js-Viewport.
                </p>
              </div>
            </div>

            <SolarControls
              :azimuth="azimuth"
              :nominal-power-watts="nominalPowerWatts"
              :panel-count="panelCount"
              :time-hour="timeHour"
              :tilt="tilt"
              :weather="weather"
              @update:azimuth="azimuth = $event"
              @update:panel-count="panelCount = $event"
              @update:time-hour="timeHour = $event"
              @update:tilt="tilt = $event"
              @weather-change="setWeather"
            />

            <SimulationResults
              :azimuth="azimuth"
              :error="error"
              :is-loading="isLoading"
              :panel-count="panelCount"
              :result="result"
              :time-hour="timeHour"
              :tilt="tilt"
            />
          </div>

          <div class="space-y-4">
            <SolarScene
              :azimuth="azimuth"
              :is-daylight="Boolean(result?.sun.isDaylight)"
              :sun-azimuth="result?.sun.azimuth ?? 180"
              :sun-elevation="result?.sun.elevation ?? 0"
              :tilt="tilt"
              :weather-factor="result?.weatherFactor ?? 1"
            />
          </div>
        </div>

        <p class="max-w-3xl text-sm leading-6 text-slate-400">
          Der Prototyp bleibt bewusst vereinfacht: Die API berechnet die Simulationswerte, der Client übernimmt nur Interaktion und Visualisierung.
        </p>
      </section>
    </div>
  </main>
</template>

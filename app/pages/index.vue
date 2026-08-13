<script setup lang="ts">
import SolarScene from '~/components/three/SolarScene.vue'

useSeoMeta({
  title: 'SolarMount 3D',
  description: 'Interaktive Simulation einer Solarmodul-Konfiguration',
})
</script>

<template>
  <main class="relative min-h-dvh overflow-hidden bg-slate-950 text-slate-100">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.18),_transparent_36%)]" />
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />

    <div class="relative mx-auto flex min-h-dvh max-w-7xl items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
      <section class="grid w-full gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)] lg:items-center">
        <div class="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-8 lg:p-10">
          <p class="text-sm font-medium uppercase tracking-[0.35em] text-sky-300/80">
            Interview Prototype
          </p>

          <div class="space-y-4">
            <h1 class="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              SolarMount 3D
            </h1>

            <p class="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Interaktive Solarmodul-Simulation
            </p>
          </div>

          <p class="max-w-xl rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-sm leading-6 text-slate-300">
            Vereinfachtes Simulationsmodell – keine technische Auslegung oder Ertragsprognose.
          </p>
        </div>

        <div class="space-y-4">
          <ClientOnly>
            <SolarScene />
          </ClientOnly>

          <p class="max-w-2xl text-sm leading-6 text-slate-400">
            Der 3D-Prototyp zeigt nur die visuelle Grundlage. Parametersteuerung, Wettersimulation und die Verbindung zur Berechnungs-API folgen in einer späteren Phase.
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

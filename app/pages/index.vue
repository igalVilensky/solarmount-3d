<script setup lang="ts">
useSeoMeta({
  title: 'SolarMount 3D',
  description: 'Interaktive Simulation einer Solarmodul-Konfiguration',
})
</script>

<template>
  <main class="relative min-h-dvh overflow-hidden bg-slate-950 text-slate-100">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.16),_transparent_38%)]" />

    <div class="relative mx-auto flex min-h-dvh max-w-5xl items-center px-6 py-16 sm:px-8 lg:px-12">
      <section class="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-12 lg:p-16">
        <p class="text-sm font-medium uppercase tracking-[0.35em] text-sky-300/80">
          Interview Prototype
        </p>

        <h1 class="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          SolarMount 3D
        </h1>

        <p class="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Interaktive Simulation einer Solarmodul-Konfiguration
        </p>

        <p class="mt-8 inline-flex max-w-2xl rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-sm leading-6 text-slate-300">
          Vereinfachtes Simulationsmodell – keine technische Auslegung oder Ertragsprognose.
        </p>
      </section>
    </div>
  </main>
</template>

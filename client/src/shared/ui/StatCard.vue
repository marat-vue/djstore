<script setup lang="ts">
defineProps<{ label: string; value: string | number; hint?: string; tone?: 'purple' | 'cyan' | 'green' | 'pink' }>();
</script>

<template>
  <article class="stat-card" :class="`stat-card--${tone ?? 'purple'}`">
    <div class="stat-card__icon"><slot name="icon" /></div>
    <div><p class="text-xs font-semibold text-[var(--text-muted)]">{{ label }}</p><p class="mt-1 text-2xl font-bold tracking-[-.04em] text-[var(--text)]">{{ value }}</p><p v-if="hint" class="mt-1 text-xs text-[var(--text-soft)]">{{ hint }}</p></div>
  </article>
</template>

<style scoped>
.stat-card { position: relative; display: flex; align-items: center; gap: 1rem; overflow: hidden; padding: 1.15rem; border: 1px solid var(--border); border-radius: 20px; background: var(--bg-elevated); }
.stat-card::after { content: ''; position: absolute; width: 90px; height: 90px; right: -35px; top: -40px; border-radius: 50%; background: currentColor; filter: blur(32px); opacity: .13; }
.stat-card__icon { width: 44px; height: 44px; display: grid; place-items: center; flex: none; color: currentColor; border-radius: 14px; background: color-mix(in srgb, currentColor 11%, transparent); }
.stat-card--purple { color: var(--accent); }.stat-card--cyan { color: var(--cyan); }.stat-card--green { color: var(--success); }.stat-card--pink { color: var(--accent-2); }
</style>

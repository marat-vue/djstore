<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="app-footer">
    <div class="container-shell app-footer__inner">
      <div>
        <p class="font-extrabold tracking-[.12em] text-[var(--text)]">DJ STORE</p>
        <p class="mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">Музыкальные запросы без неловких записок и потерянных переводов.</p>
      </div>
      <nav class="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-[var(--text-muted)]" aria-label="Навигация в подвале">
        <RouterLink to="/">О сервисе</RouterLink>
        <RouterLink to="/tracks">Каталог</RouterLink>
        <RouterLink to="/finance">Финансы</RouterLink>
      </nav>
      <p class="text-xs text-[var(--text-soft)]">© {{ year }} DJ Store</p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer { margin-top: auto; border-top: 1px solid var(--border); background: color-mix(in srgb, var(--bg-solid) 38%, transparent); }
.app-footer__inner { min-height: 150px; display: grid; grid-template-columns: 1.4fr 1fr auto; align-items: center; gap: 2rem; }
a:hover { color: var(--text); }
@media (max-width: 760px) { .app-footer__inner { grid-template-columns: 1fr; align-items: start; padding-block: 2rem; gap: 1.25rem; } }
</style>

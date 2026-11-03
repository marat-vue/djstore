<script setup lang="ts">
import { CheckCircleIcon, MusicalNoteIcon, QrCodeIcon } from '@heroicons/vue/24/outline';
import PageShell from '@/widgets/page-shell/ui/PageShell.vue';

defineProps<{ eyebrow: string; title: string; description: string }>();
</script>

<template>
  <PageShell>
    <section class="container-shell auth-layout page-space">
      <aside class="auth-story">
        <p class="eyebrow">Музыка работает на вас</p>
        <h1 class="auth-story__title">Каждый запрос — часть атмосферы.</h1>
        <p class="mt-5 max-w-lg text-base leading-7 text-[var(--text-muted)]">
          Один QR-код связывает гостей, диджея и понятную финансовую историю.
        </p>
        <div class="mt-10 grid gap-3">
          <div class="auth-benefit"><QrCodeIcon /><span><strong>Быстрый старт</strong>QR-код создаётся автоматически</span></div>
          <div class="auth-benefit"><MusicalNoteIcon /><span><strong>Живая очередь</strong>Запросы собраны в одном месте</span></div>
          <div class="auth-benefit"><CheckCircleIcon /><span><strong>Полный контроль</strong>Вы решаете, что прозвучит</span></div>
        </div>
      </aside>

      <div class="surface auth-card">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2 class="text-3xl font-bold tracking-[-.035em] text-[var(--text)]">{{ title }}</h2>
        <p class="mt-3 text-sm leading-6 text-[var(--text-muted)]">{{ description }}</p>
        <div class="mt-7"><slot /></div>
      </div>
    </section>
  </PageShell>
</template>

<style scoped>
.auth-layout { min-height: calc(100vh - 222px); display: grid; grid-template-columns: minmax(0, 1fr) minmax(380px, 470px); align-items: center; gap: clamp(3rem, 8vw, 8rem); }
.auth-story { padding-left: clamp(0rem, 4vw, 3rem); }
.auth-story__title { max-width: 650px; font-size: clamp(2.7rem, 6vw, 5.4rem); font-weight: 760; line-height: .96; letter-spacing: -.06em; }
.auth-benefit { display: flex; align-items: center; gap: .9rem; padding: .85rem 0; color: var(--text-muted); }
.auth-benefit > svg { width: 22px; color: var(--accent); }
.auth-benefit span { display: grid; gap: .1rem; font-size: .8rem; }
.auth-benefit strong { color: var(--text); font-size: .92rem; }
.auth-card { padding: clamp(1.5rem, 5vw, 2.5rem); }
@media (max-width: 900px) { .auth-layout { grid-template-columns: 1fr; gap: 2rem; } .auth-story { display: none; } .auth-card { width: min(100%, 520px); margin-inline: auto; } }
</style>

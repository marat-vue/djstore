<script setup lang="ts">
import { BanknotesIcon, CursorArrowRaysIcon, QrCodeIcon, QueueListIcon } from '@heroicons/vue/24/outline';
const features = [
  { number: '01', title: 'QR вместо приложения', text: 'Гость открывает каталог камерой телефона — без регистрации и установки.', icon: QrCodeIcon, tone: 'purple' },
  { number: '02', title: 'Запрос в два касания', text: 'Выбор трека, ставка и понятная демо-оплата без лишних экранов.', icon: CursorArrowRaysIcon, tone: 'cyan' },
  { number: '03', title: 'Решение остаётся за вами', text: 'Принимайте оплаченные запросы или отклоняйте то, что не подходит атмосфере.', icon: QueueListIcon, tone: 'pink' },
  { number: '04', title: 'Прозрачная выручка', text: 'Баланс, начисления и заявки на вывод собраны в финансовом разделе.', icon: BanknotesIcon, tone: 'green' },
];
</script>

<template>
  <section class="features-section">
    <div class="container-shell">
      <div class="section-heading"><div><p class="eyebrow">Возможности</p><h2>Меньше рутины.<br>Больше вайба.</h2></div><p>Интерфейс одинаково понятен гостю за столиком и менеджеру за ноутбуком.</p></div>
      <div class="features-grid">
        <article v-for="feature in features" :key="feature.number" class="feature-card" :class="`feature-card--${feature.tone}`">
          <div class="flex items-start justify-between"><span class="feature-card__icon"><component :is="feature.icon" class="size-6" /></span><small>{{ feature.number }}</small></div>
          <h3>{{ feature.title }}</h3><p>{{ feature.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-section { padding-block: clamp(4rem, 9vw, 8rem); border-block: 1px solid var(--border); background: color-mix(in srgb, var(--bg-solid) 34%, transparent); }.section-heading { display: flex; align-items: end; justify-content: space-between; gap: 2rem; margin-bottom: 2.5rem; }.section-heading h2 { font-size: clamp(2.4rem, 5vw, 4.2rem); line-height: .98; letter-spacing: -.055em; font-weight: 760; }.section-heading > p { max-width: 420px; color: var(--text-muted); line-height: 1.7; }.features-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .9rem; }.feature-card { min-height: 275px; display: flex; flex-direction: column; padding: 1.3rem; color: var(--accent); border: 1px solid var(--border); border-radius: 23px; background: var(--bg-elevated); transition: .22s ease; }.feature-card:hover { transform: translateY(-4px); border-color: color-mix(in srgb, currentColor 36%, var(--border)); box-shadow: 0 22px 50px color-mix(in srgb, currentColor 8%, transparent); }.feature-card__icon { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 15px; background: color-mix(in srgb, currentColor 11%, transparent); }.feature-card small { opacity: .55; font-weight: 800; }.feature-card h3 { margin-top: auto; color: var(--text); font-size: 1.1rem; font-weight: 750; }.feature-card p { margin-top: .65rem; color: var(--text-muted); font-size: .82rem; line-height: 1.65; }.feature-card--cyan { color: var(--cyan); }.feature-card--pink { color: var(--accent-2); }.feature-card--green { color: var(--success); }
@media (max-width: 980px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }.section-heading { align-items: start; flex-direction: column; } @media (max-width: 560px) { .features-grid { grid-template-columns: 1fr; }.feature-card { min-height: 220px; } }
</style>

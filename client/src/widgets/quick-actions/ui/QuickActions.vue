<script setup lang="ts">
import { BanknotesIcon, MusicalNoteIcon, PlusIcon, QueueListIcon } from '@heroicons/vue/24/outline';
const actions = [
  { to: '/tracks/add', title: 'Добавить трек', text: 'Расширить гостевой каталог', icon: PlusIcon, tone: 'purple' },
  { to: '/requests', title: 'Открыть запросы', text: 'Обработать новую очередь', icon: QueueListIcon, tone: 'cyan' },
  { to: '/tracks', title: 'Управлять каталогом', text: 'Цены, жанры и обложки', icon: MusicalNoteIcon, tone: 'pink' },
  { to: '/withdrawals', title: 'Вывести средства', text: 'Создать заявку на вывод', icon: BanknotesIcon, tone: 'green' },
];
</script>

<template>
  <section>
    <div class="mb-4 flex items-center justify-between"><h2 class="text-lg font-bold">Быстрые действия</h2><span class="text-xs text-[var(--text-soft)]">Всё под рукой</span></div>
    <div class="quick-grid">
      <RouterLink v-for="action in actions" :key="action.to" :to="action.to" class="quick-action" :class="`quick-action--${action.tone}`">
        <span><component :is="action.icon" class="size-5" /></span>
        <div><strong>{{ action.title }}</strong><small>{{ action.text }}</small></div>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.quick-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .8rem; }
.quick-action { display: flex; align-items: center; gap: .9rem; padding: 1rem; border: 1px solid var(--border); border-radius: 18px; background: var(--bg-elevated); transition: .2s ease; }
.quick-action:hover { transform: translateY(-2px); border-color: var(--border-strong); box-shadow: 0 14px 35px color-mix(in srgb, currentColor 7%, transparent); }
.quick-action > span { width: 42px; height: 42px; display: grid; place-items: center; flex: none; color: currentColor; border-radius: 13px; background: color-mix(in srgb, currentColor 11%, transparent); }
.quick-action div { min-width: 0; display: grid; gap: .15rem; }.quick-action strong { color: var(--text); font-size: .86rem; }.quick-action small { overflow: hidden; color: var(--text-muted); font-size: .72rem; text-overflow: ellipsis; white-space: nowrap; }
.quick-action--purple { color: var(--accent); }.quick-action--cyan { color: var(--cyan); }.quick-action--pink { color: var(--accent-2); }.quick-action--green { color: var(--success); }
@media (max-width: 560px) { .quick-grid { grid-template-columns: 1fr; } }
</style>

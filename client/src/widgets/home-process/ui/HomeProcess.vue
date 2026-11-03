<script setup lang="ts">
const steps = [
  { number: '01', title: 'Создайте пространство', text: 'Зарегистрируйте заведение и заполните каталог.' },
  { number: '02', title: 'Покажите QR', text: 'Скачайте код и разместите его там, где сидят гости.' },
  { number: '03', title: 'Управляйте моментом', text: 'Получайте запросы, принимайте решения и следите за балансом.' },
];
</script>

<template>
  <section id="how-it-works" class="process-section container-shell">
    <div class="process-copy"><p class="eyebrow">Как это работает</p><h2>От регистрации<br>до первого запроса<br><span>за один вечер.</span></h2><RouterLink to="/register" class="button button--primary mt-8">Начать бесплатно</RouterLink></div>
    <div class="process-steps"><article v-for="step in steps" :key="step.number"><span>{{ step.number }}</span><div><h3>{{ step.title }}</h3><p>{{ step.text }}</p></div></article></div>
  </section>
</template>

<style scoped>
.process-section { display: grid; grid-template-columns: .85fr 1.15fr; gap: clamp(3rem, 9vw, 9rem); padding-block: clamp(5rem, 11vw, 10rem); }.process-copy h2 { font-size: clamp(2.3rem, 5vw, 4.6rem); line-height: .98; letter-spacing: -.06em; font-weight: 770; }.process-copy h2 span { color: var(--accent); }.process-steps { display: grid; align-content: center; }.process-steps article { display: grid; grid-template-columns: 64px 1fr; gap: 1.2rem; padding: 1.6rem 0; border-bottom: 1px solid var(--border); }.process-steps article:first-child { border-top: 1px solid var(--border); }.process-steps span { width: 45px; height: 45px; display: grid; place-items: center; color: var(--accent); border-radius: 50%; background: color-mix(in srgb, var(--accent) 10%, transparent); font-size: .72rem; font-weight: 850; }.process-steps h3 { font-size: 1.2rem; font-weight: 750; }.process-steps p { margin-top: .45rem; color: var(--text-muted); font-size: .88rem; line-height: 1.65; }
@media (max-width: 800px) { .process-section { grid-template-columns: 1fr; } }
</style>

<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import PageShell from '@/widgets/page-shell/ui/PageShell.vue';
</script>
<template><PageShell><section class="container-shell not-found"><div><p class="not-found__code">404</p><p class="eyebrow">Трек не найден</p><h1 class="page-title">Кажется, эта страница ушла со сцены.</h1><p class="page-description">Вернитесь на главную — там музыка продолжается.</p><RouterLink to="/" class="button button--primary mt-7"><ArrowLeftIcon class="size-4" />На главную</RouterLink></div></section></PageShell></template>
<style scoped>.not-found { min-height: calc(100vh - 220px); display: grid; place-items: center; padding-block: 4rem; text-align: center; }.not-found > div { max-width: 700px; }.not-found__code { color: transparent; background: linear-gradient(100deg, var(--accent), var(--accent-2), var(--cyan)); background-clip: text; font-size: clamp(6rem, 18vw, 13rem); font-weight: 900; line-height: .8; letter-spacing: -.1em; }.not-found .eyebrow { margin-top: 2rem; }.not-found .page-description { margin-inline: auto; }</style>

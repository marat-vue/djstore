<script setup lang="ts">
import PageShell from '@/widgets/page-shell/ui/PageShell.vue';
import PageHeader from '@/shared/ui/PageHeader.vue';
import TrackForm from '@/features/track-form/ui/TrackForm.vue';
</script>
<template><PageShell><section class="container-shell page-space"><PageHeader eyebrow="Каталог" title="Добавить трек" description="Обложка, жанр и понятная минимальная ставка — всё, что увидит гость." /><TrackForm mode="create" /></section></PageShell></template>

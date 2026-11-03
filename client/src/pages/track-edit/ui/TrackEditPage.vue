<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import PageShell from '@/widgets/page-shell/ui/PageShell.vue';
import PageHeader from '@/shared/ui/PageHeader.vue';
import TrackForm from '@/features/track-form/ui/TrackForm.vue';
const route = useRoute();
const trackId = computed(() => Number(route.params.id));
</script>
<template><PageShell><section class="container-shell page-space"><PageHeader eyebrow="Каталог" title="Редактировать трек" description="Изменения сразу появятся в гостевом каталоге." /><TrackForm mode="edit" :track-id="trackId" /></section></PageShell></template>

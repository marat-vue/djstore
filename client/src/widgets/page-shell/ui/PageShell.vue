<script setup lang="ts">
import AppHeader from '@/widgets/app-header/ui/AppHeader.vue';
import AppFooter from '@/widgets/app-footer/ui/AppFooter.vue';
withDefaults(defineProps<{ hideFooter?: boolean }>(), { hideFooter: false });
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main"><slot /></main>
    <AppFooter v-if="!hideFooter" />
  </div>
</template>

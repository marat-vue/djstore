<script setup lang="ts">
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false });
</script>

<template>
  <RouterLink to="/" class="logo" aria-label="DJ Store — главная">
    <span class="logo__mark"><span /><span /><span /></span>
    <span v-if="!compact" class="logo__text">DJ STORE</span>
  </RouterLink>
</template>

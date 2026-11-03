<script setup lang="ts">
import { computed } from 'vue';
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline';
import { useThemeStore } from '../model/theme-store';

const store = useThemeStore();
const isDark = computed(() => store.theme === 'dark');
</script>

<template>
  <button class="icon-button" type="button" :aria-label="isDark ? 'Включить светлую тему' : 'Включить тёмную тему'" @click="store.toggle">
    <SunIcon v-if="isDark" class="size-5" />
    <MoonIcon v-else class="size-5" />
  </button>
</template>

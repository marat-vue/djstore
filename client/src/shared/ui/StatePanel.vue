<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

withDefaults(defineProps<{
  state: 'loading' | 'empty' | 'error';
  title: string;
  description?: string;
}>(), { description: '' });
defineEmits<{ retry: [] }>();
</script>

<template>
  <div class="state-panel">
    <div v-if="state === 'loading'" class="state-panel__icon">
      <ArrowPathIcon class="size-6 animate-spin" />
    </div>
    <div v-else class="state-panel__icon"><slot name="icon" /></div>
    <h3 class="mt-4 text-base font-semibold text-[var(--text)]">{{ title }}</h3>
    <p v-if="description" class="mt-1 max-w-md text-sm leading-6 text-[var(--text-muted)]">{{ description }}</p>
    <button v-if="state === 'error'" type="button" class="button button--secondary mt-5" @click="$emit('retry')">
      Повторить
    </button>
  </div>
</template>

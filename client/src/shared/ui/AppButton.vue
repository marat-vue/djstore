<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

withDefaults(defineProps<{
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
}>(), {
  type: 'button',
  variant: 'primary',
  loading: false,
  disabled: false,
  block: false,
});
</script>

<template>
  <button
    :type="type"
    class="button"
    :class="[`button--${variant}`, { 'w-full': block }]"
    :disabled="disabled || loading"
  >
    <ArrowPathIcon v-if="loading" class="size-4 animate-spin" />
    <slot v-else name="icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

defineOptions({ inheritAttrs: false });
defineProps<{ label?: string; error?: string }>();
const model = defineModel<string | number>({ required: true });
const selectId = useId();
</script>

<template>
  <label class="field" :for="selectId">
    <span v-if="label" class="field__label">{{ label }}</span>
    <span class="field__control" :class="{ 'field__control--error': error }">
      <select
        :id="selectId"
        v-model="model"
        class="appearance-none pr-11"
        v-bind="$attrs"
      >
        <slot />
      </select>
      <ChevronDownIcon class="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[var(--text-soft)]" />
    </span>
    <span v-if="error" class="field__error">{{ error }}</span>
  </label>
</template>

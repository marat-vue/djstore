<script setup lang="ts">
import { useId } from 'vue';

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<{
  label?: string;
  hint?: string;
  error?: string;
  type?: string;
}>(), {
  label: undefined,
  hint: undefined,
  error: undefined,
  type: 'text',
});

const model = defineModel<string | number>({ required: true });
const inputId = useId();
</script>

<template>
  <label class="field" :for="inputId">
    <span v-if="label" class="field__label">{{ label }}</span>
    <span class="field__control" :class="{ 'field__control--error': error }">
      <span v-if="$slots.icon" class="field__icon"><slot name="icon" /></span>
      <input
        :id="inputId"
        v-model="model"
        :type="type"
        :class="{ 'pl-11': $slots.icon }"
        v-bind="$attrs"
      />
    </span>
    <span v-if="error" class="field__error">{{ error }}</span>
    <span v-else-if="hint" class="field__hint">{{ hint }}</span>
  </label>
</template>

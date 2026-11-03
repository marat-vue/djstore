<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{ open: boolean; title: string; description?: string }>();
const emit = defineEmits<{ close: [] }>();

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) emit('close');
}

watch(() => props.open, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
}, { immediate: true });
window.addEventListener('keydown', onKeydown);
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal" role="dialog" aria-modal="true" :aria-label="title" @mousedown.self="emit('close')">
        <section class="modal__panel">
          <button class="icon-button absolute right-4 top-4" type="button" aria-label="Закрыть" @click="emit('close')">
            <XMarkIcon class="size-5" />
          </button>
          <div class="pr-10">
            <h2 class="text-xl font-semibold text-[var(--text)]">{{ title }}</h2>
            <p v-if="description" class="mt-2 text-sm leading-6 text-[var(--text-muted)]">{{ description }}</p>
          </div>
          <div class="mt-6"><slot /></div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

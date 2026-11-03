<script setup lang="ts">
import { ref, watch } from 'vue';
import { MusicalNoteIcon } from '@heroicons/vue/24/solid';
import { getInitials } from '@/shared/lib/format';

const props = defineProps<{ src?: string; title: string; size?: 'sm' | 'md' | 'lg' }>();
const failed = ref(!props.src);
watch(() => props.src, (src) => { failed.value = !src; });
</script>

<template>
  <div class="track-artwork" :class="`track-artwork--${size ?? 'md'}`">
    <img v-if="src && !failed" :src="src" :alt="`Обложка ${title}`" loading="lazy" @error="failed = true" />
    <div v-else class="track-artwork__fallback">
      <MusicalNoteIcon class="size-5 opacity-70" />
      <span>{{ getInitials(title) || 'DJ' }}</span>
    </div>
  </div>
</template>

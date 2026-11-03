<script setup lang="ts">
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { Track } from '../model/types';
import TrackArtwork from './TrackArtwork.vue';
import { formatMoney } from '@/shared/lib/format';

defineProps<{ track: Track; deleting?: boolean }>();
defineEmits<{ edit: []; remove: [] }>();
</script>

<template>
  <article class="track-card">
    <TrackArtwork :src="track.icon" :title="track.title" size="md" />
    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h3 class="truncate font-bold text-[var(--text)]">{{ track.title }}</h3>
          <p class="mt-1 truncate text-sm text-[var(--text-muted)]">{{ track.artist }}</p>
        </div>
        <span class="track-card__price">{{ formatMoney(track.price) }}</span>
      </div>
      <div class="mt-4 flex items-center justify-between gap-3">
        <span class="rounded-full bg-[var(--bg-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)]">{{ track.genre.name }}</span>
        <div class="flex gap-1">
          <button type="button" class="icon-button !size-9" aria-label="Редактировать трек" @click="$emit('edit')"><PencilSquareIcon class="size-4" /></button>
          <button type="button" class="icon-button !size-9 hover:!text-[var(--danger)]" :disabled="deleting" aria-label="Удалить трек" @click="$emit('remove')"><TrashIcon class="size-4" /></button>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.track-card { display: flex; gap: 1rem; padding: 1rem; border: 1px solid var(--border); border-radius: 20px; background: var(--bg-elevated); transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease; }
.track-card:hover { transform: translateY(-2px); border-color: var(--border-strong); box-shadow: 0 15px 35px color-mix(in srgb, var(--accent) 7%, transparent); }
.track-card__price { flex: none; color: var(--accent); font-size: .85rem; font-weight: 800; }
</style>

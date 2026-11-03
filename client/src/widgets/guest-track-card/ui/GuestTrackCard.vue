<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import type { Track } from '@/entities/track/model/types';
import TrackArtwork from '@/entities/track/ui/TrackArtwork.vue';
import { formatMoney } from '@/shared/lib/format';
defineProps<{ track: Track }>();
defineEmits<{ select: [] }>();
</script>

<template>
  <button type="button" class="guest-track" @click="$emit('select')">
    <TrackArtwork :src="track.icon" :title="track.title" size="lg" />
    <span class="min-w-0 flex-1 text-left"><strong>{{ track.title }}</strong><small>{{ track.artist }}</small><em>{{ track.genre.name }}</em></span>
    <span class="guest-track__price"><small>от</small>{{ formatMoney(track.price) }}</span>
    <ArrowRightIcon class="size-4 flex-none text-[var(--text-soft)]" />
  </button>
</template>

<style scoped>
.guest-track { width: 100%; display: flex; align-items: center; gap: 1rem; padding: .9rem; color: var(--text); border: 1px solid var(--border); border-radius: 21px; background: var(--bg-elevated); text-align: left; transition: .2s ease; }.guest-track:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--accent) 40%, var(--border)); box-shadow: 0 18px 40px color-mix(in srgb, var(--accent) 9%, transparent); }.guest-track strong, .guest-track small, .guest-track em { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.guest-track strong { font-size: .95rem; }.guest-track small { margin-top: .2rem; color: var(--text-muted); font-size: .76rem; }.guest-track em { width: fit-content; margin-top: .5rem; padding: .22rem .45rem; color: var(--accent); border-radius: 999px; background: color-mix(in srgb, var(--accent) 9%, transparent); font-size: .64rem; font-style: normal; font-weight: 700; }.guest-track__price { flex: none; color: var(--accent); font-size: .85rem; font-weight: 850; }.guest-track__price small { margin: 0; color: var(--text-soft); font-size: .62rem; font-weight: 600; }
@media (max-width: 560px) { .guest-track :deep(.track-artwork--lg) { width: 70px; height: 70px; } .guest-track__price { display: none; } }
</style>

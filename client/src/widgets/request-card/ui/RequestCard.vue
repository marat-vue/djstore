<script setup lang="ts">
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import type { TrackRequest } from '@/entities/track-request/model/types';
import { requestStatusLabel, requestStatusTone } from '@/entities/track-request/model/presentation';
import TrackArtwork from '@/entities/track/ui/TrackArtwork.vue';
import StatusBadge from '@/shared/ui/StatusBadge.vue';
import AppButton from '@/shared/ui/AppButton.vue';
import { formatDateTime, formatMoney } from '@/shared/lib/format';

defineProps<{ request: TrackRequest; updating?: boolean }>();
defineEmits<{ accept: []; reject: [] }>();
</script>

<template>
  <article class="request-card">
    <TrackArtwork :src="request.track.icon" :title="request.track.title" size="lg" />
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div class="min-w-0"><h3 class="truncate text-lg font-bold">{{ request.track.title }}</h3><p class="mt-1 truncate text-sm text-[var(--text-muted)]">{{ request.track.artist }} · {{ request.track.genre.name }}</p></div>
        <div class="flex flex-wrap gap-2"><StatusBadge :tone="request.is_paid ? 'success' : 'warning'">{{ request.is_paid ? 'Оплачен' : 'Не оплачен' }}</StatusBadge><StatusBadge :tone="requestStatusTone[request.status]">{{ requestStatusLabel[request.status] }}</StatusBadge></div>
      </div>
      <div class="request-card__meta">
        <div><span>Предложение</span><strong class="text-[var(--success)]">{{ formatMoney(request.user_fee) }}</strong></div>
        <div><span>Минимум</span><strong>{{ formatMoney(request.min_fee) }}</strong></div>
        <div><span>Создан</span><strong>{{ formatDateTime(request.created_at) }}</strong></div>
      </div>
      <div v-if="request.status === 'pending'" class="mt-5 flex flex-wrap justify-end gap-2 border-t border-[var(--border)] pt-4">
        <AppButton variant="ghost" :disabled="updating" @click="$emit('reject')"><template #icon><XMarkIcon class="size-4" /></template>Отклонить</AppButton>
        <AppButton :loading="updating" :disabled="!request.is_paid" @click="$emit('accept')"><template #icon><CheckIcon class="size-4" /></template>Принять</AppButton>
      </div>
    </div>
  </article>
</template>

<style scoped>
.request-card { display: flex; gap: 1.25rem; padding: 1.2rem; border: 1px solid var(--border); border-radius: 22px; background: var(--bg-elevated); }
.request-card__meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .75rem; margin-top: 1.1rem; }
.request-card__meta div { display: grid; gap: .2rem; padding: .7rem .8rem; border-radius: 13px; background: var(--bg-soft); }.request-card__meta span { color: var(--text-soft); font-size: .68rem; }.request-card__meta strong { overflow: hidden; color: var(--text); font-size: .79rem; text-overflow: ellipsis; white-space: nowrap; }
@media (max-width: 660px) { .request-card { align-items: flex-start; } .request-card :deep(.track-artwork--lg) { width: 64px; height: 64px; border-radius: 16px; } .request-card__meta { grid-template-columns: 1fr 1fr; } .request-card__meta div:last-child { grid-column: 1 / -1; } }
</style>

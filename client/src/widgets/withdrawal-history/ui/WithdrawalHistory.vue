<script setup lang="ts">
import { ClockIcon } from '@heroicons/vue/24/outline';
import type { Withdrawal } from '@/entities/finance/model/types';
import { withdrawalStatusLabel, withdrawalStatusTone } from '@/entities/finance/model/presentation';
import StatusBadge from '@/shared/ui/StatusBadge.vue';
import { formatDateTime, formatMoney } from '@/shared/lib/format';
defineProps<{ items: Withdrawal[] }>();
</script>

<template>
  <div class="grid gap-3">
    <article v-for="item in items" :key="item.id" class="withdrawal-item">
      <div class="withdrawal-item__amount"><strong>{{ formatMoney(item.amount) }}</strong><span>комиссия {{ formatMoney(item.fee) }}</span></div>
      <div class="flex items-center gap-2 text-xs text-[var(--text-muted)]"><ClockIcon class="size-4" />{{ formatDateTime(item.created_at) }}</div>
      <StatusBadge :tone="withdrawalStatusTone[item.status]">{{ withdrawalStatusLabel[item.status] }}</StatusBadge>
    </article>
  </div>
</template>

<style scoped>
.withdrawal-item { display: grid; grid-template-columns: 1fr 1fr auto; align-items: center; gap: 1rem; padding: 1rem 1.15rem; border: 1px solid var(--border); border-radius: 18px; background: var(--bg-elevated); }.withdrawal-item__amount { display: grid; gap: .1rem; }.withdrawal-item__amount strong { font-size: 1rem; }.withdrawal-item__amount span { color: var(--text-soft); font-size: .7rem; }
@media (max-width: 620px) { .withdrawal-item { grid-template-columns: 1fr auto; }.withdrawal-item > :nth-child(2) { grid-column: 1 / -1; grid-row: 2; } }
</style>

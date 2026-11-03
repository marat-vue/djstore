<script setup lang="ts">
import { ArrowDownLeftIcon, ArrowUpRightIcon } from '@heroicons/vue/24/outline';
import type { Transaction } from '@/entities/finance/model/types';
import { transactionLabel } from '@/entities/finance/model/presentation';
import { formatDateTime, formatMoney } from '@/shared/lib/format';
defineProps<{ items: Transaction[] }>();
</script>

<template>
  <div class="surface overflow-hidden">
    <div class="transaction-head"><span>Операция</span><span>Дата</span><span class="text-right">Сумма</span></div>
    <div v-for="item in items" :key="item.id" class="transaction-row">
      <div class="flex items-center gap-3"><span class="transaction-icon" :class="item.transaction_type === 'withdrawal' ? 'negative' : 'positive'"><ArrowDownLeftIcon v-if="item.transaction_type === 'withdrawal'" /><ArrowUpRightIcon v-else /></span><strong>{{ transactionLabel[item.transaction_type] }}</strong></div>
      <time>{{ formatDateTime(item.created_at) }}</time>
      <span class="text-right font-bold" :class="item.transaction_type === 'withdrawal' ? 'text-[var(--danger)]' : 'text-[var(--success)]'">{{ item.amount > 0 ? '+' : '' }}{{ formatMoney(item.amount) }}</span>
    </div>
  </div>
</template>

<style scoped>
.transaction-head, .transaction-row { display: grid; grid-template-columns: 1.2fr 1fr .6fr; align-items: center; gap: 1rem; padding: .9rem 1.2rem; }.transaction-head { color: var(--text-soft); border-bottom: 1px solid var(--border); background: var(--bg-soft); font-size: .68rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }.transaction-row { min-height: 68px; border-bottom: 1px solid var(--border); font-size: .83rem; }.transaction-row:last-child { border: 0; }.transaction-row time { color: var(--text-muted); }.transaction-icon { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 12px; }.transaction-icon svg { width: 17px; }.transaction-icon.positive { color: var(--success); background: color-mix(in srgb, var(--success) 10%, transparent); }.transaction-icon.negative { color: var(--danger); background: color-mix(in srgb, var(--danger) 10%, transparent); }
@media (max-width: 600px) { .transaction-head { display: none; } .transaction-row { grid-template-columns: 1fr auto; }.transaction-row time { grid-column: 1 / -1; padding-left: 49px; font-size: .72rem; }.transaction-row > span:last-child { grid-column: 2; grid-row: 1; } }
</style>

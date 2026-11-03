<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSessionStore } from '@/entities/session/model/session-store';
import { useFinanceStore } from '@/entities/finance/model/finance-store';
import { formatMoney } from '@/shared/lib/format';
import AppInput from '@/shared/ui/AppInput.vue';
import AppButton from '@/shared/ui/AppButton.vue';

const emit = defineEmits<{ success: [] }>();
const session = useSessionStore();
const finance = useFinanceStore();
const amount = ref('');
const localError = ref('');
const numericAmount = computed(() => Number(amount.value));
const fee = computed(() => Math.trunc((numericAmount.value || 0) * .05));
const payout = computed(() => Math.max(0, numericAmount.value - fee.value));
const valid = computed(() => numericAmount.value >= 500 && numericAmount.value <= (session.profile?.balance ?? 0));

async function submit() {
  localError.value = '';
  if (numericAmount.value < 500) localError.value = 'Минимальная сумма вывода — 500 ₽';
  else if (numericAmount.value > (session.profile?.balance ?? 0)) localError.value = 'На балансе недостаточно средств';
  if (localError.value) return;
  if (await finance.withdraw(numericAmount.value)) {
    amount.value = '';
    await session.fetchProfile();
    emit('success');
  }
}
</script>

<template>
  <form class="surface withdrawal-form" @submit.prevent="submit">
    <p class="eyebrow">Новая заявка</p>
    <h2 class="text-2xl font-bold tracking-[-.03em]">Вывести средства</h2>
    <p class="mt-2 text-sm leading-6 text-[var(--text-muted)]">В демо-режиме заявка обрабатывается мгновенно. Карточные данные не требуются и не хранятся.</p>
    <div class="mt-6"><AppInput v-model="amount" label="Сумма, ₽" type="number" min="500" step="1" inputmode="numeric" :max="session.profile?.balance" placeholder="500" :error="localError" required /></div>
    <div class="withdrawal-summary">
      <p><span>Комиссия 5%</span><strong>{{ formatMoney(fee) }}</strong></p>
      <p><span>К зачислению</span><strong class="text-[var(--success)]">{{ formatMoney(payout) }}</strong></p>
      <p><span>Доступно</span><strong>{{ formatMoney(session.profile?.balance ?? 0) }}</strong></p>
    </div>
    <p v-if="finance.error" class="mt-4 text-sm text-[var(--danger)]">{{ finance.error }}</p>
    <AppButton class="mt-5" type="submit" block :loading="finance.isWithdrawing" :disabled="!valid">Подтвердить вывод</AppButton>
  </form>
</template>

<style scoped>
.withdrawal-form { padding: 1.5rem; }.withdrawal-summary { display: grid; gap: .7rem; margin-top: 1.2rem; padding: 1rem; border-radius: 16px; background: var(--bg-soft); }.withdrawal-summary p { display: flex; justify-content: space-between; gap: 1rem; color: var(--text-muted); font-size: .8rem; }.withdrawal-summary strong { color: var(--text); }
</style>

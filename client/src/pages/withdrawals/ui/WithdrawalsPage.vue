<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { BanknotesIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';
import PageShell from '@/widgets/page-shell/ui/PageShell.vue';
import PageHeader from '@/shared/ui/PageHeader.vue';
import StatePanel from '@/shared/ui/StatePanel.vue';
import StatusBadge from '@/shared/ui/StatusBadge.vue';
import WithdrawalForm from '@/features/withdrawal/ui/WithdrawalForm.vue';
import WithdrawalHistory from '@/widgets/withdrawal-history/ui/WithdrawalHistory.vue';
import { useFinanceStore } from '@/entities/finance/model/finance-store';
import { useSessionStore } from '@/entities/session/model/session-store';

const finance = useFinanceStore();
const session = useSessionStore();
const success = ref(false);
onMounted(() => Promise.all([session.fetchProfile(), finance.fetchWithdrawals()]));
function showSuccess() { success.value = true; window.setTimeout(() => { success.value = false; }, 3500); }
</script>

<template>
  <PageShell>
    <section class="container-shell page-space">
      <PageHeader eyebrow="Выплаты" title="Вывод средств" description="Создавайте заявки и отслеживайте их историю в одном спокойном интерфейсе."><template #actions><StatusBadge tone="info">Демо-режим</StatusBadge></template></PageHeader>
      <Transition name="fade-page"><div v-if="success" class="success-banner"><CheckCircleIcon class="size-5" />Средства успешно выведены</div></Transition>
      <div class="withdrawals-layout">
        <WithdrawalForm @success="showSuccess" />
        <section>
          <h2 class="mb-4 text-lg font-bold">История заявок</h2>
          <StatePanel v-if="finance.isLoadingWithdrawals" state="loading" title="Загружаем историю" />
          <StatePanel v-else-if="!finance.withdrawals.length" state="empty" title="Выводов ещё не было" description="Первая заявка появится здесь сразу после создания."><template #icon><BanknotesIcon class="size-6" /></template></StatePanel>
          <WithdrawalHistory v-else :items="finance.withdrawals" />
        </section>
      </div>
    </section>
  </PageShell>
</template>

<style scoped>
.withdrawals-layout { display: grid; grid-template-columns: 360px minmax(0, 1fr); align-items: start; gap: 1.5rem; }.success-banner { display: flex; align-items: center; gap: .6rem; margin-bottom: 1rem; padding: .8rem 1rem; color: var(--success); border: 1px solid color-mix(in srgb, var(--success) 22%, transparent); border-radius: 15px; background: color-mix(in srgb, var(--success) 8%, transparent); font-size: .85rem; font-weight: 700; }
@media (max-width: 820px) { .withdrawals-layout { grid-template-columns: 1fr; } }
</style>

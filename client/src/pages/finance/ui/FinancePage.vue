<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, BanknotesIcon } from '@heroicons/vue/24/outline';
import PageShell from '@/widgets/page-shell/ui/PageShell.vue';
import PageHeader from '@/shared/ui/PageHeader.vue';
import StatCard from '@/shared/ui/StatCard.vue';
import StatePanel from '@/shared/ui/StatePanel.vue';
import TransactionList from '@/widgets/transaction-list/ui/TransactionList.vue';
import { useSessionStore } from '@/entities/session/model/session-store';
import { useFinanceStore } from '@/entities/finance/model/finance-store';
import { formatMoney } from '@/shared/lib/format';

const session = useSessionStore();
const finance = useFinanceStore();
const income = computed(() => finance.transactions.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0));
const withdrawn = computed(() => Math.abs(finance.transactions.filter((item) => item.amount < 0).reduce((sum, item) => sum + item.amount, 0)));
onMounted(() => Promise.all([session.fetchProfile(), finance.fetchTransactions()]));
</script>

<template>
  <PageShell>
    <section class="container-shell page-space">
      <PageHeader eyebrow="Финансы" title="Движение средств" description="Баланс и история операций без лишних таблиц и бухгалтерской магии."><template #actions><RouterLink to="/withdrawals" class="button button--primary">Вывести средства</RouterLink></template></PageHeader>
      <div class="finance-stats">
        <StatCard label="Текущий баланс" :value="formatMoney(session.profile?.balance ?? 0)" tone="purple"><template #icon><BanknotesIcon class="size-5" /></template></StatCard>
        <StatCard label="Всего поступило" :value="formatMoney(income)" tone="green"><template #icon><ArrowTrendingUpIcon class="size-5" /></template></StatCard>
        <StatCard label="Всего выведено" :value="formatMoney(withdrawn)" tone="pink"><template #icon><ArrowTrendingDownIcon class="size-5" /></template></StatCard>
      </div>
      <h2 class="mb-4 mt-8 text-lg font-bold">История операций</h2>
      <StatePanel v-if="finance.isLoadingTransactions" state="loading" title="Загружаем операции" />
      <StatePanel v-else-if="!finance.transactions.length" state="empty" title="Операций пока нет" description="Пополнения появятся после принятия оплаченных запросов."><template #icon><BanknotesIcon class="size-6" /></template></StatePanel>
      <TransactionList v-else :items="finance.transactions" />
    </section>
  </PageShell>
</template>

<style scoped>.finance-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .9rem; } @media (max-width: 760px) { .finance-stats { grid-template-columns: 1fr; } }</style>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { BanknotesIcon, MusicalNoteIcon, QueueListIcon, SparklesIcon } from '@heroicons/vue/24/outline';
import PageShell from '@/widgets/page-shell/ui/PageShell.vue';
import PageHeader from '@/shared/ui/PageHeader.vue';
import StatCard from '@/shared/ui/StatCard.vue';
import VenueProfileCard from '@/widgets/venue-profile-card/ui/VenueProfileCard.vue';
import QuickActions from '@/widgets/quick-actions/ui/QuickActions.vue';
import { useSessionStore } from '@/entities/session/model/session-store';
import { useTrackStore } from '@/entities/track/model/track-store';
import { useTrackRequestStore } from '@/entities/track-request/model/track-request-store';
import { formatMoney } from '@/shared/lib/format';

const session = useSessionStore();
const tracks = useTrackStore();
const requests = useTrackRequestStore();
const pending = computed(() => requests.items.filter((item) => item.status === 'pending').length);
const paidPending = computed(() => requests.items.filter((item) => item.status === 'pending' && item.is_paid).length);

onMounted(async () => {
  if (!session.profile) return;
  await Promise.all([tracks.fetchAll(session.profile.id), requests.fetchAll()]);
});
</script>

<template>
  <PageShell>
    <section class="container-shell page-space">
      <PageHeader eyebrow="Панель управления" :title="`Добрый вечер, ${session.profile?.name ?? 'DJ'}`" description="Актуальная картина по каталогу, запросам и балансу заведения." />
      <div class="stats-grid">
        <StatCard label="Баланс" :value="formatMoney(session.profile?.balance ?? 0)" hint="Доступно к выводу" tone="green"><template #icon><BanknotesIcon class="size-5" /></template></StatCard>
        <StatCard label="Треков в каталоге" :value="tracks.items.length" hint="Видят ваши гости" tone="purple"><template #icon><MusicalNoteIcon class="size-5" /></template></StatCard>
        <StatCard label="Ожидают решения" :value="pending" :hint="`${paidPending} уже оплачено`" tone="cyan"><template #icon><QueueListIcon class="size-5" /></template></StatCard>
        <StatCard label="Готовность" value="Online" hint="QR-каталог активен" tone="pink"><template #icon><SparklesIcon class="size-5" /></template></StatCard>
      </div>
      <div class="dashboard-grid mt-6">
        <VenueProfileCard v-if="session.profile" :profile="session.profile" />
        <QuickActions />
      </div>
    </section>
  </PageShell>
</template>

<style scoped>
.stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .9rem; }
.dashboard-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(300px, .65fr); align-items: start; gap: 1.25rem; }
@media (max-width: 1000px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .dashboard-grid { grid-template-columns: 1fr; } }
@media (max-width: 560px) { .stats-grid { grid-template-columns: 1fr; } }
</style>

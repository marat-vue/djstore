<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ArchiveBoxIcon, InboxIcon } from '@heroicons/vue/24/outline';
import PageShell from '@/widgets/page-shell/ui/PageShell.vue';
import PageHeader from '@/shared/ui/PageHeader.vue';
import StatePanel from '@/shared/ui/StatePanel.vue';
import RequestCard from '@/widgets/request-card/ui/RequestCard.vue';
import { useTrackRequestStore } from '@/entities/track-request/model/track-request-store';

const store = useTrackRequestStore();
const tab = ref<'incoming' | 'processed'>('incoming');
const incoming = computed(() => store.items.filter((item) => item.status === 'pending'));
const processed = computed(() => store.items.filter((item) => item.status !== 'pending'));
const visible = computed(() => tab.value === 'incoming' ? incoming.value : processed.value);
onMounted(store.fetchAll);
</script>

<template>
  <PageShell>
    <section class="container-shell page-space">
      <PageHeader eyebrow="Очередь" title="Запросы гостей" description="Оплаченные запросы готовы к решению. Неоплаченные остаются в ожидании гостя." />
      <div class="tabs" role="tablist">
        <button type="button" :class="{ active: tab === 'incoming' }" @click="tab = 'incoming'"><InboxIcon class="size-4" />Новые <span>{{ incoming.length }}</span></button>
        <button type="button" :class="{ active: tab === 'processed' }" @click="tab = 'processed'"><ArchiveBoxIcon class="size-4" />Обработанные <span>{{ processed.length }}</span></button>
      </div>
      <div v-if="store.error" class="mt-4 rounded-2xl border border-[var(--border)] p-4 text-sm text-[var(--danger)]">{{ store.error }}</div>
      <StatePanel v-if="store.isLoading" class="mt-5" state="loading" title="Загружаем запросы" />
      <StatePanel v-else-if="!visible.length" class="mt-5" state="empty" :title="tab === 'incoming' ? 'Новых запросов нет' : 'История пока пуста'" description="Когда гости отправят треки, они появятся здесь."><template #icon><InboxIcon class="size-6" /></template></StatePanel>
      <div v-else class="mt-5 grid gap-3">
        <RequestCard v-for="item in visible" :key="item.id" :request="item" :updating="store.updatingId === item.id" @accept="store.updateStatus(item.id, 'accepted')" @reject="store.updateStatus(item.id, 'rejected')" />
      </div>
    </section>
  </PageShell>
</template>

<style scoped>
.tabs { display: inline-flex; gap: .3rem; padding: .3rem; border: 1px solid var(--border); border-radius: 15px; background: var(--bg-elevated); }
.tabs button { display: flex; align-items: center; gap: .5rem; padding: .58rem .78rem; border-radius: 11px; color: var(--text-muted); font-size: .82rem; font-weight: 700; }.tabs button.active { color: var(--text); background: var(--bg-soft); }.tabs span { min-width: 21px; height: 21px; display: grid; place-items: center; border-radius: 50%; background: var(--bg-solid); font-size: .67rem; }
</style>

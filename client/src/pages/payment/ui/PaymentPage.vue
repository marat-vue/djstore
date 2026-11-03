<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { CheckCircleIcon, ClockIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline';
import PageShell from '@/widgets/page-shell/ui/PageShell.vue';
import StatePanel from '@/shared/ui/StatePanel.vue';
import StatusBadge from '@/shared/ui/StatusBadge.vue';
import TrackArtwork from '@/entities/track/ui/TrackArtwork.vue';
import type { TrackRequest } from '@/entities/track-request/model/types';
import { trackRequestApi } from '@/entities/track-request/api/track-request-api';
import MockPaymentPanel from '@/features/mock-payment/ui/MockPaymentPanel.vue';
import { getApiError } from '@/shared/lib/api-error';
import { formatDateTime, formatMoney } from '@/shared/lib/format';

const route = useRoute();
const token = computed(() => String(route.params.token));
const data = ref<TrackRequest | null>(null);
const loading = ref(false);
const error = ref('');
const success = ref(false);
async function load() { loading.value = true; error.value = ''; try { data.value = (await trackRequestApi.getPayment(token.value)).data; } catch (requestError) { error.value = getApiError(requestError, 'Платёж не найден'); } finally { loading.value = false; } }
function paid() { if (data.value) data.value.is_paid = true; success.value = true; }
onMounted(load);
</script>

<template>
  <PageShell>
    <section class="container-shell payment-page page-space">
      <StatePanel v-if="loading" state="loading" title="Проверяем запрос" />
      <StatePanel v-else-if="error || !data" state="error" title="Не удалось открыть платёж" :description="error" @retry="load"><template #icon><MusicalNoteIcon class="size-6" /></template></StatePanel>
      <template v-else>
        <div class="payment-details">
          <p class="eyebrow">Оплата запроса</p><h1 class="page-title">Почти в эфире</h1><p class="page-description">Проверьте трек и подтвердите тестовую оплату.</p>
          <article class="surface-subtle mt-8 p-5"><div class="flex items-center gap-4"><TrackArtwork :src="data.track.icon" :title="data.track.title" size="lg" /><div class="min-w-0"><h2 class="truncate text-xl font-bold">{{ data.track.title }}</h2><p class="mt-1 truncate text-sm text-[var(--text-muted)]">{{ data.track.artist }} · {{ data.track.genre.name }}</p><StatusBadge class="mt-3" :tone="data.is_paid ? 'success' : 'warning'">{{ data.is_paid ? 'Оплачен' : 'Ожидает оплаты' }}</StatusBadge></div></div><div class="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-5 text-sm"><div><span class="block text-xs text-[var(--text-soft)]">Ставка</span><strong class="mt-1 block text-[var(--success)]">{{ formatMoney(data.user_fee) }}</strong></div><div><span class="block text-xs text-[var(--text-soft)]">Создан</span><strong class="mt-1 flex items-center gap-1.5"><ClockIcon class="size-4" />{{ formatDateTime(data.created_at) }}</strong></div></div></article>
        </div>
        <MockPaymentPanel :request="data" @paid="paid" />
      </template>
    </section>
  </PageShell>
  <div v-if="success" class="payment-success"><CheckCircleIcon class="size-6" /><div><strong>Оплата подтверждена</strong><p>Запрос уже видит диджей</p></div><button type="button" @click="success = false">×</button></div>
</template>

<style scoped>
.payment-page { min-height: calc(100vh - 220px); display: grid; grid-template-columns: minmax(0, 1fr) 390px; align-items: center; gap: clamp(2rem, 8vw, 7rem); }.payment-success { position: fixed; z-index: 90; right: 1rem; bottom: 1rem; display: flex; align-items: center; gap: .8rem; padding: .9rem 1rem; color: var(--success); border: 1px solid color-mix(in srgb, var(--success) 24%, transparent); border-radius: 17px; background: var(--bg-solid); box-shadow: var(--shadow); }.payment-success strong { color: var(--text); font-size: .85rem; }.payment-success p { font-size: .72rem; }.payment-success button { margin-left: .5rem; color: var(--text-soft); font-size: 1.2rem; }
@media (max-width: 850px) { .payment-page { grid-template-columns: 1fr; align-items: start; gap: 2rem; } }
</style>

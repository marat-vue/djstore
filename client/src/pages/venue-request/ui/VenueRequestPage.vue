<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MagnifyingGlassIcon, MusicalNoteIcon, SparklesIcon } from '@heroicons/vue/24/outline';
import PageShell from '@/widgets/page-shell/ui/PageShell.vue';
import PageHeader from '@/shared/ui/PageHeader.vue';
import AppInput from '@/shared/ui/AppInput.vue';
import AppSelect from '@/shared/ui/AppSelect.vue';
import AppModal from '@/shared/ui/AppModal.vue';
import AppButton from '@/shared/ui/AppButton.vue';
import StatePanel from '@/shared/ui/StatePanel.vue';
import GuestTrackCard from '@/widgets/guest-track-card/ui/GuestTrackCard.vue';
import RequestTrackModal from '@/features/request-track/ui/RequestTrackModal.vue';
import { trackApi } from '@/entities/track/api/track-api';
import type { Genre, Track } from '@/entities/track/model/types';
import type { TrackRequest } from '@/entities/track-request/model/types';
import { getApiError } from '@/shared/lib/api-error';
import { formatMoney } from '@/shared/lib/format';

const route = useRoute();
const router = useRouter();
const venueId = computed(() => Number(route.params.id));
const tracks = ref<Track[]>([]);
const loading = ref(false);
const error = ref('');
const search = ref('');
const genre = ref('');
const selected = ref<Track | null>(null);
const created = ref<TrackRequest | null>(null);
const genres = computed<Genre[]>(() => [...new Map(tracks.value.map((track) => [track.genre.id, track.genre])).values()]);
const visible = computed(() => {
  const query = search.value.trim().toLowerCase();
  return tracks.value.filter((track) => (!query || `${track.title} ${track.artist}`.toLowerCase().includes(query)) && (!genre.value || track.genre.id === Number(genre.value)));
});

async function load() {
  if (!Number.isInteger(venueId.value) || venueId.value < 1) { error.value = 'Некорректная ссылка на заведение'; return; }
  loading.value = true; error.value = '';
  try { tracks.value = (await trackApi.getAll(venueId.value)).data; }
  catch (requestError) { error.value = getApiError(requestError, 'Не удалось открыть каталог'); }
  finally { loading.value = false; }
}

function complete(request: TrackRequest) { selected.value = null; created.value = request; }
onMounted(load);
</script>

<template>
  <PageShell>
    <section class="guest-hero"><div class="container-shell"><span class="guest-hero__icon"><SparklesIcon class="size-5" /></span><p>Выберите трек, предложите ставку и передайте запрос диджею</p></div></section>
    <section class="container-shell page-space !pt-10">
      <PageHeader eyebrow="Гостевой каталог" title="Что поставить дальше?" description="Ищите по названию или исполнителю. Минимальная ставка указана у каждого трека." />
      <div class="guest-filters">
        <AppInput v-model="search" placeholder="Найти трек или артиста" aria-label="Поиск по каталогу"><template #icon><MagnifyingGlassIcon /></template></AppInput>
        <AppSelect v-model="genre" aria-label="Выбрать жанр"><option value="">Все жанры</option><option v-for="item in genres" :key="item.id" :value="item.id">{{ item.name }}</option></AppSelect>
      </div>
      <StatePanel v-if="loading" class="mt-5" state="loading" title="Открываем музыкальный каталог" />
      <StatePanel v-else-if="error" class="mt-5" state="error" title="Каталог недоступен" :description="error" @retry="load"><template #icon><MusicalNoteIcon class="size-6" /></template></StatePanel>
      <StatePanel v-else-if="!visible.length" class="mt-5" state="empty" title="Ничего не нашли" description="Попробуйте изменить запрос или выбрать другой жанр."><template #icon><MusicalNoteIcon class="size-6" /></template></StatePanel>
      <div v-else class="guest-grid mt-5"><GuestTrackCard v-for="track in visible" :key="track.id" :track="track" @select="selected = track" /></div>
    </section>
    <RequestTrackModal :track="selected" :venue-id="venueId" @close="selected = null" @created="complete" />
    <AppModal :open="Boolean(created)" title="Запрос создан" description="Остался последний шаг — подтвердить тестовую оплату." @close="created = null">
      <div v-if="created" class="rounded-2xl bg-[var(--bg-soft)] p-4"><p class="font-bold">{{ created.track.title }}</p><p class="mt-1 text-sm text-[var(--text-muted)]">Ставка {{ formatMoney(created.user_fee) }}</p></div>
      <div class="mt-5 flex justify-end gap-3"><AppButton variant="ghost" @click="created = null">Позже</AppButton><AppButton @click="router.push(`/request/pay/${created?.payment_token}`)">Перейти к оплате</AppButton></div>
    </AppModal>
  </PageShell>
</template>

<style scoped>
.guest-hero { padding: .8rem 0; border-bottom: 1px solid var(--border); background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 12%, transparent), color-mix(in srgb, var(--cyan) 8%, transparent)); }.guest-hero > div { display: flex; align-items: center; justify-content: center; gap: .65rem; color: var(--text-muted); font-size: .8rem; }.guest-hero__icon { width: 30px; height: 30px; display: grid; place-items: center; color: var(--accent); border-radius: 10px; background: var(--bg-elevated); }.guest-filters { display: grid; grid-template-columns: 1fr 230px; gap: .75rem; padding: .85rem; border: 1px solid var(--border); border-radius: 20px; background: var(--bg-elevated); }.guest-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .9rem; }
@media (max-width: 760px) { .guest-grid, .guest-filters { grid-template-columns: 1fr; } }
</style>

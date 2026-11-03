<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { MusicalNoteIcon, PlusIcon } from '@heroicons/vue/24/outline';
import PageShell from '@/widgets/page-shell/ui/PageShell.vue';
import PageHeader from '@/shared/ui/PageHeader.vue';
import StatePanel from '@/shared/ui/StatePanel.vue';
import TrackFilters from '@/features/track-filter/ui/TrackFilters.vue';
import TrackCard from '@/entities/track/ui/TrackCard.vue';
import DeleteTrackModal from '@/features/track-delete/ui/DeleteTrackModal.vue';
import { useSessionStore } from '@/entities/session/model/session-store';
import { useTrackStore } from '@/entities/track/model/track-store';
import type { Track, TrackFilters as Filters } from '@/entities/track/model/types';

const session = useSessionStore();
const tracks = useTrackStore();
const router = useRouter();
const selectedForDelete = ref<Track | null>(null);
const venueId = computed(() => session.profile?.id);

async function load(filters?: Filters) {
  if (venueId.value) await tracks.fetchAll(venueId.value, filters);
}

onMounted(async () => {
  await Promise.all([tracks.fetchGenres(), load()]);
});
</script>

<template>
  <PageShell>
    <section class="container-shell page-space">
      <PageHeader eyebrow="Каталог" title="Ваши треки" description="Управляйте музыкой, которую гости видят после сканирования QR-кода.">
        <template #actions><RouterLink to="/tracks/add" class="button button--primary"><PlusIcon class="size-4" />Добавить трек</RouterLink></template>
      </PageHeader>

      <TrackFilters :genres="tracks.genres" :loading="tracks.isLoading" @apply="load" />
      <div v-if="tracks.error" class="mt-4 rounded-2xl border border-[color-mix(in_srgb,var(--danger)_25%,transparent)] bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] p-4 text-sm text-[var(--danger)]">{{ tracks.error }}</div>

      <StatePanel v-if="tracks.isLoading && !tracks.items.length" class="mt-5" state="loading" title="Собираем каталог" />
      <StatePanel v-else-if="!tracks.items.length" class="mt-5" state="empty" title="Каталог пока пуст" description="Добавьте первый трек и укажите минимальную ставку.">
        <template #icon><MusicalNoteIcon class="size-6" /></template>
      </StatePanel>
      <div v-else class="track-grid mt-5">
        <TrackCard
          v-for="track in tracks.items"
          :key="track.id"
          :track="track"
          :deleting="tracks.deletingId === track.id"
          @edit="router.push(`/tracks/${track.id}/edit`)"
          @remove="selectedForDelete = track"
        />
      </div>
    </section>
    <DeleteTrackModal :track="selectedForDelete" @close="selectedForDelete = null" />
  </PageShell>
</template>

<style scoped>
.track-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
@media (max-width: 720px) { .track-grid { grid-template-columns: 1fr; } }
</style>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { PhotoIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { useSessionStore } from '@/entities/session/model/session-store';
import { useTrackStore } from '@/entities/track/model/track-store';
import TrackArtwork from '@/entities/track/ui/TrackArtwork.vue';
import AppInput from '@/shared/ui/AppInput.vue';
import AppSelect from '@/shared/ui/AppSelect.vue';
import AppButton from '@/shared/ui/AppButton.vue';
import AppModal from '@/shared/ui/AppModal.vue';
import StatePanel from '@/shared/ui/StatePanel.vue';

const props = defineProps<{ mode: 'create' | 'edit'; trackId?: number }>();
const session = useSessionStore();
const tracks = useTrackStore();
const router = useRouter();
const genreModal = ref(false);
const newGenre = ref('');
const validationError = ref('');
const form = reactive({ title: '', artist: '', icon: '', genreId: '', price: '100' });
const heading = computed(() => props.mode === 'create' ? 'Новый трек' : 'Редактирование трека');

onMounted(async () => {
  await tracks.fetchGenres();
  if (props.mode === 'edit' && props.trackId && session.profile) {
    const track = await tracks.fetchOne(session.profile.id, props.trackId);
    if (!track) {
      await router.replace('/tracks');
      return;
    }
    Object.assign(form, {
      title: track.title,
      artist: track.artist,
      icon: track.icon,
      genreId: String(track.genre.id),
      price: String(track.price),
    });
  }
});

async function submit() {
  validationError.value = '';
  const price = Number(form.price);
  if (!form.genreId) validationError.value = 'Выберите жанр';
  else if (!Number.isInteger(price) || price < 1) validationError.value = 'Укажите корректную цену';
  if (validationError.value || !session.profile) return;

  const payload = {
    title: form.title.trim(), artist: form.artist.trim(), icon: form.icon.trim(),
    genre_id: Number(form.genreId), price,
  };
  const result = props.mode === 'create'
    ? await tracks.create(session.profile.id, payload)
    : await tracks.update(session.profile.id, props.trackId!, payload);
  if (result) await router.push('/tracks');
}

async function addGenre() {
  if (!newGenre.value.trim()) return;
  const genre = await tracks.createGenre(newGenre.value.trim());
  if (genre) {
    form.genreId = String(genre.id);
    newGenre.value = '';
    genreModal.value = false;
  }
}
</script>

<template>
  <StatePanel v-if="mode === 'edit' && tracks.isLoading" state="loading" title="Загружаем трек" />
  <div v-else class="track-form-layout">
    <form class="surface grid gap-5 p-5 sm:p-7" @submit.prevent="submit">
      <div v-if="validationError || tracks.error" class="form-alert">{{ validationError || tracks.error }}</div>
      <div class="grid gap-5 sm:grid-cols-2">
        <AppInput v-model="form.title" label="Название" placeholder="One More Time" maxlength="100" required />
        <AppInput v-model="form.artist" label="Исполнитель" placeholder="Daft Punk" maxlength="100" required />
      </div>
      <AppInput v-model="form.icon" label="Ссылка на обложку" type="url" placeholder="https://…" hint="Можно оставить пустым — покажем фирменную заглушку">
        <template #icon><PhotoIcon /></template>
      </AppInput>
      <div class="grid items-end gap-3 sm:grid-cols-[1fr_auto]">
        <AppSelect v-model="form.genreId" label="Жанр" required>
          <option value="" disabled>Выберите жанр</option>
          <option v-for="genre in tracks.genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
        </AppSelect>
        <AppButton variant="secondary" @click="genreModal = true"><template #icon><PlusIcon class="size-4" /></template>Жанр</AppButton>
      </div>
      <AppInput v-model="form.price" label="Минимальная ставка, ₽" type="number" min="1" step="1" inputmode="numeric" required />
      <div class="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <AppButton variant="ghost" @click="router.push('/tracks')">Отмена</AppButton>
        <AppButton type="submit" :loading="tracks.isSaving">{{ mode === 'create' ? 'Добавить трек' : 'Сохранить изменения' }}</AppButton>
      </div>
    </form>

    <aside class="surface-subtle preview-card">
      <p class="eyebrow">Предпросмотр</p>
      <TrackArtwork :src="form.icon" :title="form.title || 'Новый трек'" size="lg" />
      <h2 class="mt-5 text-xl font-bold">{{ form.title || heading }}</h2>
      <p class="mt-1 text-sm text-[var(--text-muted)]">{{ form.artist || 'Исполнитель' }}</p>
      <div class="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-5 text-sm">
        <span class="text-[var(--text-muted)]">Ставка от</span><strong class="text-[var(--accent)]">{{ Number(form.price) || 0 }} ₽</strong>
      </div>
    </aside>
  </div>

  <AppModal :open="genreModal" title="Новый жанр" description="Жанр сразу появится в списке и будет выбран для трека." @close="genreModal = false">
    <form class="grid gap-4" @submit.prevent="addGenre">
      <AppInput v-model="newGenre" label="Название жанра" placeholder="Nu disco" maxlength="100" autofocus required />
      <div class="flex justify-end gap-3"><AppButton variant="ghost" @click="genreModal = false">Отмена</AppButton><AppButton type="submit">Добавить</AppButton></div>
    </form>
  </AppModal>
</template>

<style scoped>
.track-form-layout { display: grid; grid-template-columns: minmax(0, 1fr) 280px; align-items: start; gap: 1.25rem; }
.preview-card { position: sticky; top: 96px; padding: 1.5rem; }
.form-alert { padding: .8rem 1rem; color: var(--danger); border: 1px solid color-mix(in srgb, var(--danger) 24%, transparent); border-radius: 14px; background: color-mix(in srgb, var(--danger) 9%, transparent); font-size: .84rem; }
@media (max-width: 800px) { .track-form-layout { grid-template-columns: 1fr; } .preview-card { position: static; order: -1; } }
</style>

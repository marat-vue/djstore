<script setup lang="ts">
import { reactive } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import type { Genre, TrackFilters } from '@/entities/track/model/types';
import AppInput from '@/shared/ui/AppInput.vue';
import AppSelect from '@/shared/ui/AppSelect.vue';
import AppButton from '@/shared/ui/AppButton.vue';

defineProps<{ genres: Genre[]; loading?: boolean }>();
const emit = defineEmits<{ apply: [filters: TrackFilters] }>();
const form = reactive({ search: '', genre: '' });

function apply() {
  emit('apply', {
    ...(form.search.trim() ? { search: form.search.trim() } : {}),
    ...(form.genre ? { genre: Number(form.genre) } : {}),
  });
}

function reset() {
  form.search = '';
  form.genre = '';
  emit('apply', {});
}
</script>

<template>
  <form class="filter-bar" @submit.prevent="apply">
    <AppInput v-model="form.search" aria-label="Поиск" placeholder="Название или исполнитель">
      <template #icon><MagnifyingGlassIcon /></template>
    </AppInput>
    <AppSelect v-model="form.genre" aria-label="Фильтр по жанру">
      <option value="">Все жанры</option>
      <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
    </AppSelect>
    <AppButton type="submit" :loading="loading">Найти</AppButton>
    <AppButton variant="ghost" @click="reset">Сбросить</AppButton>
  </form>
</template>

<style scoped>
.filter-bar { display: grid; grid-template-columns: minmax(220px, 1fr) minmax(170px, .45fr) auto auto; gap: .75rem; padding: .85rem; border: 1px solid var(--border); border-radius: 20px; background: var(--bg-elevated); }
@media (max-width: 760px) { .filter-bar { grid-template-columns: 1fr 1fr; } .filter-bar > :first-child { grid-column: 1 / -1; } }
</style>

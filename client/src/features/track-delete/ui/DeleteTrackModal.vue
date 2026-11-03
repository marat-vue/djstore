<script setup lang="ts">
import { useSessionStore } from '@/entities/session/model/session-store';
import { useTrackStore } from '@/entities/track/model/track-store';
import type { Track } from '@/entities/track/model/types';
import AppModal from '@/shared/ui/AppModal.vue';
import AppButton from '@/shared/ui/AppButton.vue';

const props = defineProps<{ track: Track | null }>();
const emit = defineEmits<{ close: [] }>();
const session = useSessionStore();
const tracks = useTrackStore();

async function remove() {
  if (!props.track || !session.profile) return;
  if (await tracks.remove(session.profile.id, props.track.id)) emit('close');
}
</script>

<template>
  <AppModal
    :open="Boolean(track)"
    title="Удалить трек?"
    :description="track ? `«${track.title}» исчезнет из каталога и больше не будет доступен гостям.` : ''"
    @close="emit('close')"
  >
    <div class="flex justify-end gap-3">
      <AppButton variant="ghost" @click="emit('close')">Отмена</AppButton>
      <AppButton variant="danger" :loading="tracks.deletingId === track?.id" @click="remove">Удалить</AppButton>
    </div>
  </AppModal>
</template>

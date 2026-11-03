<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Track } from '@/entities/track/model/types';
import type { TrackRequest } from '@/entities/track-request/model/types';
import { trackRequestApi } from '@/entities/track-request/api/track-request-api';
import { getApiError } from '@/shared/lib/api-error';
import { formatMoney } from '@/shared/lib/format';
import AppModal from '@/shared/ui/AppModal.vue';
import AppInput from '@/shared/ui/AppInput.vue';
import AppButton from '@/shared/ui/AppButton.vue';

const props = defineProps<{ track: Track | null; venueId: number }>();
const emit = defineEmits<{ close: []; created: [request: TrackRequest] }>();
const fee = ref('');
const isSubmitting = ref(false);
const error = ref('');
const amount = computed(() => Number(fee.value));

watch(() => props.track, (track) => {
  fee.value = track ? String(track.price) : '';
  error.value = '';
});

async function submit() {
  if (!props.track || amount.value < props.track.price) return;
  isSubmitting.value = true;
  error.value = '';
  try {
    const result = await trackRequestApi.create(props.venueId, props.track.id, amount.value);
    emit('created', result.data);
  } catch (requestError) {
    error.value = getApiError(requestError, 'Не удалось отправить запрос');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <AppModal :open="Boolean(track)" :title="track ? `Запросить «${track.title}»` : 'Запросить трек'" :description="track ? `${track.artist} · ставка от ${formatMoney(track.price)}` : ''" @close="emit('close')">
    <form class="grid gap-5" @submit.prevent="submit">
      <AppInput v-model="fee" label="Ваша ставка, ₽" type="number" :min="track?.price" step="1" inputmode="numeric" hint="Можно предложить больше — решение всё равно остаётся за диджеем" required />
      <p v-if="error" class="text-sm text-[var(--danger)]">{{ error }}</p>
      <div class="flex justify-end gap-3"><AppButton variant="ghost" @click="emit('close')">Отмена</AppButton><AppButton type="submit" :loading="isSubmitting" :disabled="!track || amount < track.price">Продолжить</AppButton></div>
    </form>
  </AppModal>
</template>

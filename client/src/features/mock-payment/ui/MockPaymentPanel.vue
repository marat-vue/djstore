<script setup lang="ts">
import { ref } from 'vue';
import { CheckBadgeIcon, LockClosedIcon } from '@heroicons/vue/24/outline';
import type { TrackRequest } from '@/entities/track-request/model/types';
import { trackRequestApi } from '@/entities/track-request/api/track-request-api';
import { getApiError } from '@/shared/lib/api-error';
import { formatMoney } from '@/shared/lib/format';
import AppButton from '@/shared/ui/AppButton.vue';

const props = defineProps<{ request: TrackRequest }>();
const emit = defineEmits<{ paid: [] }>();
const loading = ref(false);
const error = ref('');

async function pay() {
  loading.value = true; error.value = '';
  try { await trackRequestApi.pay(props.request.payment_token, props.request.user_fee); emit('paid'); }
  catch (requestError) { error.value = getApiError(requestError, 'Не удалось подтвердить оплату'); }
  finally { loading.value = false; }
}
</script>

<template>
  <section class="surface payment-panel">
    <span class="payment-panel__icon"><LockClosedIcon class="size-6" /></span>
    <p class="eyebrow mt-5">Безопасный демо-платёж</p>
    <h2 class="text-3xl font-bold tracking-[-.04em]">{{ formatMoney(request.user_fee) }}</h2>
    <p class="mt-3 text-sm leading-6 text-[var(--text-muted)]">Банковские данные не нужны: локальный режим только меняет статус запроса на «оплачен».</p>
    <div class="my-6 h-px bg-[var(--border)]" />
    <div class="flex items-center gap-3 rounded-2xl bg-[var(--bg-soft)] p-4"><CheckBadgeIcon class="size-6 text-[var(--success)]" /><div><strong class="text-sm">Тестовый контур</strong><p class="text-xs text-[var(--text-muted)]">Деньги не списываются</p></div></div>
    <p v-if="error" class="mt-4 text-sm text-[var(--danger)]">{{ error }}</p>
    <AppButton class="mt-5" block :loading="loading" :disabled="request.is_paid" @click="pay">{{ request.is_paid ? 'Уже оплачено' : 'Подтвердить оплату' }}</AppButton>
  </section>
</template>

<style scoped>.payment-panel { padding: 1.6rem; }.payment-panel__icon { width: 54px; height: 54px; display: grid; place-items: center; color: white; border-radius: 17px; background: linear-gradient(145deg, var(--accent), var(--accent-2)); box-shadow: 0 14px 35px color-mix(in srgb, var(--accent) 28%, transparent); }</style>

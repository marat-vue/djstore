<script setup lang="ts">
import { ref } from 'vue';
import { ArrowDownTrayIcon, MapPinIcon, PencilSquareIcon, PhoneIcon, QrCodeIcon } from '@heroicons/vue/24/outline';
import type { VenueProfile } from '@/entities/session/model/types';
import { downloadFile } from '@/shared/lib/download';
import AppButton from '@/shared/ui/AppButton.vue';
import EditVenueModal from '@/features/venue-profile/ui/EditVenueModal.vue';

const props = defineProps<{ profile: VenueProfile }>();
const editing = ref(false);
const downloading = ref(false);
const downloadError = ref('');

async function downloadQr() {
  downloading.value = true;
  downloadError.value = '';
  try {
    const safeName = props.profile.name.replace(/[^\p{L}\p{N}-]+/gu, '-').toLowerCase();
    await downloadFile(props.profile.qr_code, `djstore-${safeName}.png`);
  } catch {
    downloadError.value = 'Не удалось скачать QR-код';
  } finally {
    downloading.value = false;
  }
}
</script>

<template>
  <article class="surface venue-card">
    <div class="venue-card__info">
      <div class="flex items-start justify-between gap-4">
        <div><p class="eyebrow">Ваше заведение</p><h2 class="text-2xl font-bold tracking-[-.035em]">{{ profile.name }}</h2></div>
        <button class="icon-button" type="button" aria-label="Изменить профиль" @click="editing = true"><PencilSquareIcon class="size-5" /></button>
      </div>
      <div class="mt-7 grid gap-3 text-sm text-[var(--text-muted)]">
        <p class="flex items-center gap-3"><MapPinIcon class="size-5 text-[var(--accent)]" />{{ profile.city }}</p>
        <p class="flex items-center gap-3"><PhoneIcon class="size-5 text-[var(--accent)]" />{{ profile.phone }}</p>
      </div>
      <p class="mt-7 text-xs leading-5 text-[var(--text-soft)]">Разместите QR-код на столах или барной стойке — гости сразу попадут в каталог.</p>
    </div>
    <div class="venue-card__qr">
      <div class="qr-frame"><img v-if="profile.qr_code" :src="profile.qr_code" alt="QR-код заведения"><QrCodeIcon v-else class="size-12 text-[var(--text-soft)]" /></div>
      <AppButton variant="secondary" :loading="downloading" block @click="downloadQr"><template #icon><ArrowDownTrayIcon class="size-4" /></template>Скачать QR</AppButton>
      <p v-if="downloadError" class="text-center text-xs text-[var(--danger)]">{{ downloadError }}</p>
    </div>
  </article>
  <EditVenueModal :open="editing" @close="editing = false" />
</template>

<style scoped>
.venue-card { display: grid; grid-template-columns: 1fr 210px; overflow: hidden; }
.venue-card__info { padding: 1.6rem; }
.venue-card__qr { display: grid; align-content: center; gap: .8rem; padding: 1.25rem; border-left: 1px solid var(--border); background: linear-gradient(145deg, color-mix(in srgb, var(--accent) 9%, transparent), color-mix(in srgb, var(--cyan) 6%, transparent)); }
.qr-frame { aspect-ratio: 1; display: grid; place-items: center; padding: .7rem; overflow: hidden; border-radius: 18px; background: white; box-shadow: 0 14px 40px rgba(0,0,0,.18); }
.qr-frame img { width: 100%; height: 100%; object-fit: contain; }
@media (max-width: 620px) { .venue-card { grid-template-columns: 1fr; } .venue-card__qr { border-top: 1px solid var(--border); border-left: 0; } .qr-frame { width: min(220px, 100%); margin-inline: auto; } }
</style>

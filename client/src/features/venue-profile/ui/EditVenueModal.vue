<script setup lang="ts">
import { reactive, watch } from 'vue';
import { useSessionStore } from '@/entities/session/model/session-store';
import AppModal from '@/shared/ui/AppModal.vue';
import AppInput from '@/shared/ui/AppInput.vue';
import AppButton from '@/shared/ui/AppButton.vue';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: [] }>();
const session = useSessionStore();
const form = reactive({ name: '', city: '', phone: '' });

watch(() => props.open, (open) => {
  if (open && session.profile) Object.assign(form, session.profile);
});

async function save() {
  if (await session.updateProfile({ ...form })) emit('close');
}
</script>

<template>
  <AppModal :open="open" title="Профиль заведения" description="Эти данные видны только в вашем кабинете." @close="emit('close')">
    <form class="grid gap-4" @submit.prevent="save">
      <div v-if="session.error" class="text-sm text-[var(--danger)]">{{ session.error }}</div>
      <AppInput v-model="form.name" label="Название" maxlength="100" required />
      <AppInput v-model="form.city" label="Город" maxlength="50" required />
      <AppInput v-model="form.phone" label="Телефон" type="tel" maxlength="20" required />
      <div class="mt-2 flex justify-end gap-3"><AppButton variant="ghost" @click="emit('close')">Отмена</AppButton><AppButton type="submit" :loading="session.isSubmitting">Сохранить</AppButton></div>
    </form>
  </AppModal>
</template>

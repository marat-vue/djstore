<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '@/entities/session/model/session-store';
import AppInput from '@/shared/ui/AppInput.vue';
import AppButton from '@/shared/ui/AppButton.vue';

const session = useSessionStore();
const router = useRouter();
const confirmPassword = ref('');
const localError = ref('');
const form = reactive({ username: '', password: '', email: '', name: '', city: '', phone: '' });
const complete = computed(() => Object.values(form).every((value) => value.trim()) && confirmPassword.value);

async function submit() {
  localError.value = '';
  if (form.password.length < 8) {
    localError.value = 'Пароль должен содержать минимум 8 символов';
    return;
  }
  if (form.password !== confirmPassword.value) {
    localError.value = 'Пароли не совпадают';
    return;
  }
  if (await session.register({ ...form })) await router.replace('/dashboard');
}
</script>

<template>
  <form class="grid gap-5" @submit.prevent="submit">
    <div v-if="localError || session.error" class="form-alert" role="alert">{{ localError || session.error }}</div>
    <div class="grid gap-5 sm:grid-cols-2">
      <AppInput v-model="form.name" label="Название" placeholder="Stereo Room" autocomplete="organization" required />
      <AppInput v-model="form.city" label="Город" placeholder="Москва" autocomplete="address-level2" required />
    </div>
    <AppInput v-model="form.phone" label="Телефон" type="tel" placeholder="+7 999 000-00-00" autocomplete="tel" maxlength="20" required />
    <AppInput v-model="form.email" label="Email" type="email" placeholder="hello@venue.ru" autocomplete="email" required />
    <AppInput v-model="form.username" label="Логин" placeholder="stereo_room" autocomplete="username" required />
    <div class="grid gap-5 sm:grid-cols-2">
      <AppInput v-model="form.password" label="Пароль" type="password" placeholder="От 8 символов" autocomplete="new-password" required />
      <AppInput v-model="confirmPassword" label="Повторите пароль" type="password" placeholder="Ещё раз" autocomplete="new-password" required />
    </div>
    <AppButton type="submit" block :loading="session.isSubmitting" :disabled="!complete">Создать аккаунт</AppButton>
    <p class="text-center text-sm text-[var(--text-muted)]">
      Уже есть аккаунт? <RouterLink to="/login" class="font-bold text-[var(--accent)] hover:underline">Войти</RouterLink>
    </p>
  </form>
</template>

<style scoped>
.form-alert { padding: .8rem 1rem; color: var(--danger); border: 1px solid color-mix(in srgb, var(--danger) 24%, transparent); border-radius: 14px; background: color-mix(in srgb, var(--danger) 9%, transparent); font-size: .84rem; }
</style>

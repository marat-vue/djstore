<script setup lang="ts">
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LockClosedIcon, UserIcon } from '@heroicons/vue/24/outline';
import { useSessionStore } from '@/entities/session/model/session-store';
import AppInput from '@/shared/ui/AppInput.vue';
import AppButton from '@/shared/ui/AppButton.vue';

const session = useSessionStore();
const router = useRouter();
const route = useRoute();
const form = reactive({ username: '', password: '' });

async function submit() {
  if (!form.username.trim() || !form.password) return;
  if (await session.login(form.username.trim(), form.password)) {
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
      ? route.query.redirect
      : '/dashboard';
    await router.replace(redirect);
  }
}
</script>

<template>
  <form class="grid gap-5" @submit.prevent="submit">
    <div v-if="session.error" class="form-alert" role="alert">{{ session.error }}</div>
    <AppInput v-model="form.username" label="Имя пользователя" placeholder="your_login" autocomplete="username" required>
      <template #icon><UserIcon /></template>
    </AppInput>
    <AppInput v-model="form.password" label="Пароль" type="password" placeholder="••••••••" autocomplete="current-password" required>
      <template #icon><LockClosedIcon /></template>
    </AppInput>
    <AppButton type="submit" block :loading="session.isSubmitting" :disabled="!form.username.trim() || !form.password">Войти</AppButton>
    <p class="text-center text-sm text-[var(--text-muted)]">
      Впервые здесь? <RouterLink to="/register" class="font-bold text-[var(--accent)] hover:underline">Создать аккаунт</RouterLink>
    </p>
  </form>
</template>

<style scoped>
.form-alert { padding: .8rem 1rem; color: var(--danger); border: 1px solid color-mix(in srgb, var(--danger) 24%, transparent); border-radius: 14px; background: color-mix(in srgb, var(--danger) 9%, transparent); font-size: .84rem; }
</style>

<script setup lang="ts">
import AuthLayout from '@/widgets/auth-layout/ui/AuthLayout.vue';
import SignUpForm from '@/features/auth/sign-up/ui/SignUpForm.vue';
</script>

<template>
  <AuthLayout eyebrow="Новый аккаунт" title="Подключить заведение" description="Заполните данные — QR-код и личный кабинет будут готовы сразу после регистрации.">
    <SignUpForm />
  </AuthLayout>
</template>

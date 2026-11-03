<script setup lang="ts">
import AuthLayout from '@/widgets/auth-layout/ui/AuthLayout.vue';
import SignInForm from '@/features/auth/sign-in/ui/SignInForm.vue';
</script>

<template>
  <AuthLayout eyebrow="С возвращением" title="Войти в DJ Store" description="Продолжите управлять музыкой, запросами и выручкой заведения.">
    <SignInForm />
  </AuthLayout>
</template>

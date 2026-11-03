import '@/app/styles/index.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/app/App.vue';
import router from '@/app/router';
import { useThemeStore } from '@/features/theme-toggle/model/theme-store';
import { useSessionStore } from '@/entities/session/model/session-store';

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);
  useThemeStore().initialize();
  await useSessionStore().initialize();
  app.use(router);
  await router.isReady();
  app.mount('#app');
}

void bootstrap();

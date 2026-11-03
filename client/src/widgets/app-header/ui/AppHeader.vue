<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowRightStartOnRectangleIcon,
  BanknotesIcon,
  Bars3Icon,
  ChartBarIcon,
  HomeIcon,
  MusicalNoteIcon,
  QueueListIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import AppLogo from '@/shared/ui/AppLogo.vue';
import ThemeToggle from '@/features/theme-toggle/ui/ThemeToggle.vue';
import { useSessionStore } from '@/entities/session/model/session-store';

const session = useSessionStore();
const router = useRouter();
const route = useRoute();
const isMenuOpen = ref(false);

const nav = [
  { to: '/dashboard', label: 'Обзор', icon: HomeIcon },
  { to: '/tracks', label: 'Треки', icon: MusicalNoteIcon },
  { to: '/requests', label: 'Запросы', icon: QueueListIcon },
  { to: '/finance', label: 'Финансы', icon: ChartBarIcon },
  { to: '/withdrawals', label: 'Вывод', icon: BanknotesIcon },
];

const venueName = computed(() => session.profile?.name ?? 'Заведение');
watch(() => route.fullPath, () => { isMenuOpen.value = false; });

async function logout() {
  session.logout();
  await router.push('/');
}
</script>

<template>
  <header class="app-header">
    <div class="container-shell app-header__inner">
      <AppLogo />

      <nav v-if="session.isAuthenticated" class="app-header__nav" aria-label="Основная навигация">
        <RouterLink v-for="item in nav" :key="item.to" :to="item.to" class="nav-link">
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="app-header__actions">
        <ThemeToggle />
        <template v-if="session.isAuthenticated">
          <RouterLink to="/dashboard" class="venue-chip" :title="venueName">
            <span>{{ venueName.slice(0, 1).toUpperCase() }}</span>
            <strong>{{ venueName }}</strong>
          </RouterLink>
          <button class="icon-button desktop-logout" type="button" aria-label="Выйти" @click="logout">
            <ArrowRightStartOnRectangleIcon class="size-5" />
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="button button--ghost desktop-auth">Войти</RouterLink>
          <RouterLink to="/register" class="button button--primary desktop-auth">Подключить заведение</RouterLink>
        </template>
        <button class="icon-button app-header__menu-button" type="button" :aria-expanded="isMenuOpen" aria-label="Меню" @click="isMenuOpen = !isMenuOpen">
          <XMarkIcon v-if="isMenuOpen" class="size-5" />
          <Bars3Icon v-else class="size-5" />
        </button>
      </div>
    </div>

    <Transition name="menu">
      <div v-if="isMenuOpen" class="mobile-menu">
        <nav class="container-shell py-3" aria-label="Мобильная навигация">
          <template v-if="session.isAuthenticated">
            <RouterLink v-for="item in nav" :key="item.to" :to="item.to" class="mobile-link">
              <component :is="item.icon" class="size-5" />{{ item.label }}
            </RouterLink>
            <button type="button" class="mobile-link w-full text-[var(--danger)]" @click="logout">
              <ArrowRightStartOnRectangleIcon class="size-5" />Выйти
            </button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="mobile-link">Войти</RouterLink>
            <RouterLink to="/register" class="mobile-link text-[var(--accent)]">Подключить заведение</RouterLink>
          </template>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.app-header { position: sticky; z-index: 50; top: 0; border-bottom: 1px solid var(--border); background: color-mix(in srgb, var(--bg) 78%, transparent); backdrop-filter: blur(20px); }
.app-header__inner { min-height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
.app-header__nav { display: flex; align-items: center; gap: .25rem; padding: .3rem; border: 1px solid var(--border); border-radius: 16px; background: color-mix(in srgb, var(--bg-solid) 60%, transparent); }
.nav-link { padding: .55rem .72rem; border-radius: 11px; color: var(--text-muted); font-size: .82rem; font-weight: 700; transition: .18s ease; }
.nav-link:hover, .nav-link.router-link-active { color: var(--text); background: var(--bg-soft); }
.app-header__actions { display: flex; align-items: center; gap: .55rem; }
.venue-chip { max-width: 170px; display: flex; align-items: center; gap: .55rem; padding: .36rem .65rem .36rem .38rem; border: 1px solid var(--border); border-radius: 13px; background: var(--bg-elevated); }
.venue-chip span { width: 28px; height: 28px; display: grid; place-items: center; flex: none; color: white; border-radius: 9px; background: linear-gradient(145deg, var(--accent), var(--accent-2)); font-size: .73rem; font-weight: 800; }
.venue-chip strong { overflow: hidden; color: var(--text); font-size: .78rem; text-overflow: ellipsis; white-space: nowrap; }
.app-header__menu-button { display: none; }
.desktop-logout { display: grid; }
.mobile-menu { position: absolute; inset-inline: 0; top: 100%; border-bottom: 1px solid var(--border); background: var(--bg-solid); box-shadow: var(--shadow); }
.mobile-link { display: flex; align-items: center; gap: .75rem; padding: .85rem; border-radius: 12px; color: var(--text-muted); font-size: .9rem; font-weight: 700; }
.mobile-link.router-link-active, .mobile-link:hover { color: var(--text); background: var(--bg-soft); }
.menu-enter-active, .menu-leave-active { transition: opacity .18s ease, transform .18s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(-5px); }
@media (max-width: 980px) { .app-header__nav { display: none; } .app-header__menu-button { display: grid; } }
@media (max-width: 720px) { .desktop-auth, .desktop-logout { display: none; } }
@media (max-width: 540px) { .venue-chip strong { display: none; } .venue-chip { padding-right: .38rem; } }
</style>

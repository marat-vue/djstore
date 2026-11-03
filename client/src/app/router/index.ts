import { createRouter, createWebHistory } from 'vue-router';
import { useSessionStore } from '@/entities/session/model/session-store';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/home/ui/HomePage.vue'), meta: { title: 'DJ Store — музыкальные запросы' } },
    { path: '/login', name: 'login', component: () => import('@/pages/login/ui/LoginPage.vue'), meta: { guestOnly: true, title: 'Вход — DJ Store' } },
    { path: '/register', name: 'register', component: () => import('@/pages/register/ui/RegisterPage.vue'), meta: { guestOnly: true, title: 'Регистрация — DJ Store' } },
    { path: '/dashboard', name: 'dashboard', component: () => import('@/pages/dashboard/ui/DashboardPage.vue'), meta: { requiresAuth: true, title: 'Обзор — DJ Store' } },
    { path: '/tracks', name: 'tracks', component: () => import('@/pages/tracks/ui/TracksPage.vue'), meta: { requiresAuth: true, title: 'Треки — DJ Store' } },
    { path: '/tracks/add', name: 'track-create', component: () => import('@/pages/track-create/ui/TrackCreatePage.vue'), meta: { requiresAuth: true, title: 'Новый трек — DJ Store' } },
    { path: '/tracks/:id/edit', name: 'track-edit', component: () => import('@/pages/track-edit/ui/TrackEditPage.vue'), meta: { requiresAuth: true, title: 'Редактирование трека — DJ Store' } },
    { path: '/requests', name: 'requests', component: () => import('@/pages/requests/ui/RequestsPage.vue'), meta: { requiresAuth: true, title: 'Запросы — DJ Store' } },
    { path: '/finance', name: 'finance', component: () => import('@/pages/finance/ui/FinancePage.vue'), meta: { requiresAuth: true, title: 'Финансы — DJ Store' } },
    { path: '/withdrawals', name: 'withdrawals', component: () => import('@/pages/withdrawals/ui/WithdrawalsPage.vue'), meta: { requiresAuth: true, title: 'Вывод средств — DJ Store' } },
    { path: '/venue/:id/request', name: 'venue-request', component: () => import('@/pages/venue-request/ui/VenueRequestPage.vue'), meta: { title: 'Заказать трек — DJ Store' } },
    { path: '/request/pay/:token', name: 'payment', component: () => import('@/pages/payment/ui/PaymentPage.vue'), meta: { title: 'Оплата запроса — DJ Store' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/not-found/ui/NotFoundPage.vue'), meta: { title: 'Страница не найдена — DJ Store' } },
  ],
});

router.beforeEach(async (to) => {
  const session = useSessionStore();
  if (session.hasToken && !session.profile) await session.initialize();
  if (to.meta.requiresAuth && !session.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  if (to.meta.guestOnly && session.isAuthenticated) return { name: 'dashboard' };
  return true;
});

router.afterEach((to) => {
  document.title = typeof to.meta.title === 'string' ? to.meta.title : 'DJ Store';
});

export default router;

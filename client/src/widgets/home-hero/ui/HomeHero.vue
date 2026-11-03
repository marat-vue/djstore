<script setup lang="ts">
import { ArrowRightIcon, PlayIcon, QrCodeIcon, SparklesIcon } from '@heroicons/vue/24/outline';
import { useSessionStore } from '@/entities/session/model/session-store';
const session = useSessionStore();
</script>

<template>
  <section class="home-hero">
    <div class="container-shell home-hero__grid">
      <div>
        <div class="hero-pill"><SparklesIcon class="size-4" /> Музыка, которую выбирают гости</div>
        <h1>Очередь треков.<br><span>Без очереди к DJ.</span></h1>
        <p>DJ Store превращает QR-код в живой музыкальный каталог: гости отправляют оплаченные запросы, а заведение сохраняет контроль и получает выручку.</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink :to="session.isAuthenticated ? '/dashboard' : '/register'" class="button button--primary">
            {{ session.isAuthenticated ? 'Открыть кабинет' : 'Подключить заведение' }}<ArrowRightIcon class="size-4" />
          </RouterLink>
          <a href="#how-it-works" class="button button--secondary"><PlayIcon class="size-4" />Как это работает</a>
        </div>
        <div class="hero-proof"><span><b>01</b> QR-код</span><span><b>02</b> Запрос</span><span><b>03</b> Музыка</span></div>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <div class="vinyl"><div class="vinyl__ring"><div class="vinyl__label"><span>DJ</span><small>STORE</small></div></div></div>
        <div class="now-playing surface"><span class="now-playing__cover"><QrCodeIcon class="size-7" /></span><div><small>Сейчас выбирают</small><strong>Следующий трек</strong><div class="equalizer"><i /><i /><i /><i /><i /></div></div></div>
        <div class="request-chip"><span>+1</span> новый запрос</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-hero { min-height: min(760px, calc(100vh - 72px)); display: grid; align-items: center; padding-block: clamp(4rem, 9vw, 8rem); overflow: hidden; }.home-hero__grid { display: grid; grid-template-columns: 1.08fr .92fr; align-items: center; gap: clamp(3rem, 8vw, 7rem); }.hero-pill { width: fit-content; display: flex; align-items: center; gap: .5rem; margin-bottom: 1.5rem; padding: .45rem .7rem; color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 18%, transparent); border-radius: 999px; background: color-mix(in srgb, var(--accent) 7%, transparent); font-size: .72rem; font-weight: 800; }.home-hero h1 { max-width: 760px; font-size: clamp(3.2rem, 7.5vw, 6.7rem); line-height: .88; letter-spacing: -.075em; font-weight: 800; }.home-hero h1 span { color: transparent; background: linear-gradient(100deg, var(--accent), var(--accent-2) 55%, var(--cyan)); background-clip: text; }.home-hero p { max-width: 650px; margin-top: 1.6rem; color: var(--text-muted); font-size: clamp(1rem, 2vw, 1.15rem); line-height: 1.75; }.hero-proof { display: flex; gap: 1.3rem; margin-top: 3.4rem; color: var(--text-soft); font-size: .72rem; font-weight: 700; }.hero-proof span { display: flex; align-items: center; gap: .4rem; }.hero-proof b { color: var(--accent); font-size: .65rem; }.hero-visual { position: relative; min-height: 480px; display: grid; place-items: center; }.vinyl { width: min(420px, 82vw); aspect-ratio: 1; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.12); border-radius: 50%; background: repeating-radial-gradient(circle, #17151f 0 4px, #0e0d13 5px 9px); box-shadow: -30px 40px 90px rgba(0,0,0,.4), 30px -20px 90px color-mix(in srgb, var(--accent) 20%, transparent); animation: spin 18s linear infinite; }.vinyl::before { content: ''; position: absolute; width: 102%; height: 30%; transform: rotate(-28deg); background: linear-gradient(90deg, transparent, rgba(255,255,255,.05), transparent); }.vinyl__ring { width: 37%; aspect-ratio: 1; display: grid; place-items: center; border-radius: 50%; background: linear-gradient(145deg, var(--accent), var(--accent-2)); }.vinyl__label { width: 70%; aspect-ratio: 1; display: grid; place-items: center; align-content: center; color: white; border-radius: 50%; background: #14121c; }.vinyl__label span { font-weight: 900; }.vinyl__label small { font-size: .45rem; letter-spacing: .18em; }.now-playing { position: absolute; left: 0; bottom: 1.5rem; display: flex; align-items: center; gap: .9rem; padding: .8rem 1rem; }.now-playing__cover { width: 46px; height: 46px; display: grid; place-items: center; color: white; border-radius: 13px; background: linear-gradient(145deg, var(--accent), var(--cyan)); }.now-playing small, .now-playing strong { display: block; }.now-playing small { color: var(--text-soft); font-size: .62rem; }.now-playing strong { margin-top: .15rem; font-size: .82rem; }.equalizer { height: 11px; display: flex; align-items: end; gap: 2px; margin-top: .25rem; }.equalizer i { width: 2px; height: 100%; border-radius: 2px; background: var(--accent); animation: equalize 1s ease-in-out infinite alternate; }.equalizer i:nth-child(2) { height: 45%; animation-delay: -.7s; }.equalizer i:nth-child(3) { height: 70%; animation-delay: -.2s; }.equalizer i:nth-child(4) { height: 35%; animation-delay: -.9s; }.request-chip { position: absolute; right: 0; top: 3rem; padding: .65rem .85rem; color: var(--text); border: 1px solid var(--border); border-radius: 14px; background: var(--bg-elevated); box-shadow: var(--shadow); font-size: .72rem; font-weight: 700; }.request-chip span { margin-right: .35rem; color: var(--success); }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 900px) { .home-hero__grid { grid-template-columns: 1fr; }.hero-visual { min-height: 390px; }.vinyl { width: min(350px, 80vw); } }
@media (max-width: 600px) { .hero-visual { display: none; }.hero-proof { justify-content: space-between; gap: .5rem; }.home-hero h1 { font-size: clamp(3rem, 15vw, 4.5rem); } }
</style>

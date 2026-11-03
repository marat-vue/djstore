# DJ Store frontend

Клиент DJ Store на Vue 3, TypeScript, Pinia, Vue Router и Tailwind CSS. Код
организован по Feature-Sliced Design: верхние слои используют нижние, а
бизнес-сущности, пользовательские сценарии и крупные блоки интерфейса разделены.

## Запуск

```bash
cp .env.example .env
npm install
npm run dev
```

По умолчанию приложение открывается на `http://localhost:3000`, а API ожидается
по адресу `http://127.0.0.1:8000/api/`. Адрес можно изменить через
`VITE_API_URL`.

## Проверки

```bash
npm run type-check
npm run lint
npm run build-only

# или всё сразу
npm run check
```

## Слои

```text
src/
  app/       инициализация, роутер и глобальные стили
  pages/     страницы маршрутов
  widgets/   самостоятельные крупные блоки страниц
  features/  пользовательские действия и формы
  entities/  модели, API и UI бизнес-сущностей
  shared/    общая инфраструктура, утилиты и UI-kit
```

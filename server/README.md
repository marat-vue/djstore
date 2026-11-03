# DJ Store API

Backend на TypeScript, Express.js, Drizzle ORM, Zod и SQLite.

## Команды

```bash
npm install
npm run db:migrate  # подготовить новую БД; существующие данные сохраняются
npm run dev         # разработка с автоматическим перезапуском
npm test            # интеграционные тесты
npm run type-check  # проверка TypeScript
npm run build       # сборка в dist/
npm start           # запуск собранного приложения
```

## Переменные окружения

Создайте `.env` из `.env.example`.

| Переменная | Назначение | Значение по умолчанию |
| --- | --- | --- |
| `PORT` | порт HTTP-сервера | `8000` |
| `DATABASE_URL` | путь к SQLite | `./db.sqlite3` |
| `JWT_SECRET` | ключ подписи JWT | только для разработки |
| `DOMAIN` | публичный URL backend | `http://localhost:8000` |
| `CLIENT_URL` | публичный URL frontend и QR-кодов | `http://localhost:3000` |
| `MEDIA_ROOT` | каталог медиафайлов | `./media` |
| `YOOKASSA_SHOP_ID` | идентификатор магазина ЮKassa | пусто |
| `YOOKASSA_SECRET_KEY` | секретный ключ ЮKassa | пусто |
| `MIN_WITHDRAWAL_AMOUNT` | минимальная сумма вывода | `500` |
| `WITHDRAWAL_FEE_PERCENT` | комиссия вывода | `0.05` |

В production обязательно задайте собственный `JWT_SECRET`. CORS разрешает
origin, указанный в `CLIENT_URL`.

## API

Base URL: `http://localhost:8000/api/`.

Для закрытых маршрутов передавайте заголовок `Authorization: Bearer <access>`.
Формат URL и JSON сохранён совместимым с Vue-клиентом.

| Метод | URL | Доступ | Назначение |
| --- | --- | --- | --- |
| POST | `/token/` | публичный | получить access/refresh JWT |
| POST | `/register/` | публичный | зарегистрировать заведение |
| GET, PATCH | `/profile/` | JWT | профиль заведения |
| GET, POST | `/genres/` | JWT | жанры |
| GET | `/venue/:venueId/tracks/` | публичный | список и поиск треков |
| POST | `/venue/:venueId/tracks/` | JWT, владелец | добавить трек |
| GET, PATCH, DELETE | `/venue/:venueId/tracks/:trackId/` | JWT, владелец | управление треком |
| POST | `/venue/:venueId/request/` | публичный | создать запрос трека |
| GET, POST | `/requests/pay/:paymentToken/` | публичный | просмотр/мок-оплата запроса |
| GET | `/requests/` | JWT | запросы заведения |
| PATCH | `/requests/:requestId/` | JWT | принять или отклонить запрос |
| GET | `/transactions/` | JWT | история транзакций |
| POST | `/mock-withdraw/` | JWT | тестовый вывод средств |
| POST | `/withdrawals/` | JWT | вывод через ЮKassa |
| GET | `/withdrawals/history/` | JWT | история выводов |
| POST | `/payment/:paymentToken/` | JWT | создать платёж ЮKassa |
| POST | `/payment-webhook/` | webhook | обновить платёж |
| POST | `/withdrawal-webhook/` | webhook | обновить выплату |

Все тела запросов, параметры и query-строки валидируются Zod. Ошибки полей
возвращаются с HTTP 400, ошибки авторизации — с HTTP 401.

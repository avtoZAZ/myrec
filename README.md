# MyRec — premium recipes platform (MVP)

Современный сайт рецептов на **Next.js + Tailwind + Prisma(PostgreSQL)** с отдельной админкой, импортом JSON и анимациями.

## Что реализовано

- Главная страница (hero, популярные/новые рецепты, категории, CTA).
- Каталог рецептов (поиск + фильтры).
- Страница рецепта (ингредиенты, шаги, related, печать).
- Админка:
  - логин/пароль,
  - список рецептов,
  - создание,
  - редактирование,
  - удаление,
  - публикация/черновик,
  - импорт JSON.
- JSON Schema + валидация импорта (single + bulk).
- SEO metadata + slug-based routing.

## Структура проекта

```txt
app/
  page.tsx
  recipes/page.tsx
  recipes/[slug]/page.tsx
  admin/*
  api/*
components/
lib/
  prisma.ts
  recipes.ts
  recipe-schema.json
  validators.ts
prisma/
  schema.prisma
  seed.ts
examples/
docs/
```

## Формат JSON рецепта

Описан в `lib/recipe-schema.json`.

Поддерживается:

1. Один рецепт (объект рецепта).
2. Массовый импорт:

```json
{
  "publish": false,
  "recipes": [{ "id": "...", "title": "..." }]
}
```

При ошибке валидации API возвращает понятный список `details`.

## База данных (Prisma)

- `User`: админ-пользователь.
- `Recipe`: вся доменная модель рецепта в JSON-полях для гибкости.

## Быстрый запуск

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Создайте `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/myrec"
   ```
3. Примените миграцию и сгенерируйте client:
   ```bash
   npx prisma migrate dev --name init
   npm run prisma:generate
   ```
4. Заполните тестовыми данными:
   ```bash
   npm run seed
   ```
5. Запустите проект:
   ```bash
   npm run dev
   ```

Админка: `/admin/login`, тестовый доступ `admin/admin123`.

## Импорт рецептов

- В админке используйте кнопку **Импортировать рецепт (JSON)**.
- Можно загрузить `examples/recipe.tom-yam.json` (single) или `examples/recipes.bulk.json` (bulk).

# «Ливонский ветер» — сайт

Статический лендинг: новости (главная), правила по вкладкам, референсы костюмов по фракциям.

Репозиторий: [VsevolodNagaev/pirates](https://github.com/VsevolodNagaev/pirates).

## Запуск

Нужны Node 22+ и Python 3 (скрипт забирает главы из соседней папки `правила` и каталог из `референсы-фракций`).

```bash
cd pirates
npm install
npm run dev
```

Откроется `http://localhost:5173/`. Картинки референсов Vite отдаёт напрямую с диска (`../референсы-фракций`) — в git они не входят (~570 МБ).

## Сборка

```bash
npm run build          # dist/ с корнем /
npm run build:gh       # dist/ с базой /pirates/ для GitHub Pages
npm run preview
```

GitHub Pages: Settings → Pages → GitHub Actions / deploy `dist`. Для project-site нужен `npm run build:gh`. Файл `public/.nojekyll` уже лежит в репозитории.

## Откуда контент

| Раздел | Источник |
|---|---|
| Правила | `../правила/*.md` → `src/content/rules/` |
| Референсы | `../референсы-фракций/*/SOSTAV.md` → `src/content/refs.json` |
| Новости | `src/content/news.ts` |

После правок маркдауна: `npm run generate` или просто `npm run dev`.

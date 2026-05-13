# NEXMAP (Telegram Mini App, MVP)

Стек: React 18 + TypeScript + Vite + Tailwind + Zustand + React Router (HashRouter).

## Запуск

1) Установите Node.js (у вас он уже есть) и пакетный менеджер **npm**.

- Если `npm` не находится, проще всего переустановить Node.js с сайта Node и выбрать опцию установки npm в PATH.

2) Установите зависимости:

```bash
cd nexmap
npm install
```

3) Запуск dev-сервера:

```bash
npm run dev
```

4) Сборка:

```bash
npm run build
```

## Деплой в Telegram

Задеплойте папку `dist/` на любой статический хостинг, затем в BotFather создайте Web App и укажите URL.


# YellowBird Web

Vue 3 + Vite + Tailwind 4 storefront for the YellowBird assessment project. Talks to `yellowbird-api` for products and orders; uses **Firebase Auth** in the browser for sign-in.

## Setup

```bash
npm install
cp .env.example .env   # paste Firebase web config + API URL
npm run dev
```

Configure Firebase together with the API — **[FIREBASE_SETUP.md](../yellowbird-api/FIREBASE_SETUP.md)**.

Until Firebase env vars are set, the shop still loads **demo products** from the API fallback data; sign-in, checkout, and orders need a configured project.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (default port 5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Stack

- Vue 3, Vue Router, Pinia
- Tailwind CSS 4
- Firebase Auth (client SDK)
- Lucide icons

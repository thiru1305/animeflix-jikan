
# AnimeFlix — Anime Search App

Netflix‑style Anime search built with **React 18 + TypeScript + Redux Toolkit (RTK Query) + Vite + Tailwind** using the free **Jikan v4** API.

## ✅ How to run (npm only)
```bash
npm install
npm run dev
```
Dev server runs on **http://localhost:4000** (strict port). No env vars required.

## ✨ Features
- Two pages: **Search** and **Detail**
- **Instant search** with **250ms debounce**
- **Automatic cancellation** of in‑flight requests on query/page change (via RTK Query)
- **Server‑side pagination** using Jikan's pagination metadata
- **Redux** for state (UI slice for query/page) and **RTK Query** for API cache
- Netflix‑like **dark UI**, hover cards, skeleton loaders, empty/error states
- Fully typed with **TypeScript**

## 🧭 Routing
- `/` — Search page
- `/anime/:id` — Detail page

## 🧰 Tech
- React 18, TypeScript
- Redux Toolkit + RTK Query
- react-router-dom v6
- Tailwind CSS
- Vite (server fixed to port 4000)

## 📦 Build & Deploy
```bash
npm run build
npm run preview   # serves on port 4000
```
Deploy anywhere static (Netlify recommended). **Build command:** `npm run build`. **Publish directory:** `dist`.

## 📑 Bonus Implementation
- Skeleton loaders
- Empty & error states
- URL sync of query/page for shareable searches

## 📝 AI Usage
Include your prompts in `PROMPTS.md` as required by the assignment.


## Bonus Implementation (Added)
- **Discover mode** when no query: **Hero** banner + horizontal **Rows** (Trending, Season Now, Recommendations)
- **My List** (Redux + localStorage) with quick-tap add/remove from cards and hero
- **Horizontal rails** with smooth scroll and arrow controls
- Navbar counter for My List

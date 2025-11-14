
# AI Prompts Log

Document any prompts you used to get AI assistance while building this project.

---

 **Tool:** ChatGPT
 **Context/Goal:** Implement RTK Query search with Jikan API and Netflix-like UI
 **Prompt:** *Paste your prompt here*
 **Outcome:** Search page with debounced query + cancellation via RTK Query

---

  **Tool:** ChatGPT  
  **Context/Goal:** Implement a responsive search page backed by the Jikan API using RTK Query, with a smooth UX that doesn’t spam the API on every keystroke.  
  **Prompt:** *“Help me build an anime search page using RTK Query and the Jikan API. I want Netflix-style result cards and a debounced search input that cancels in-flight requests when the query changes.”*  
  **Outcome:** Implemented `SearchPage` with a debounced input, RTK Query `searchAnime` endpoint, automatic request cancellation, and reusable `AnimeCard` + `SkeletonCard` components for loading states.

---

  **Tool:** ChatGPT  
  **Context/Goal:** Design a Netflix-inspired brand for the app (“ANIMEFLIX”) and a small footer crediting Jikan.  
  **Prompt:** *“Give me an SVG-style logo treatment for the word ANIMEFLIX that feels like Netflix, and ideas for a footer line such as ‘Powered by Jikan API’ that fits the dark theme.”*  
  **Outcome:** Created an `ANIMEFLIX` wordmark with bold red typography on a dark background, plus footer copy and layout showing “Anime data provided by Jikan API” with subtle styling consistent with the rest of the UI.

---

  **Tool:** ChatGPT  
  **Context/Goal:** Redesign the `Discover` / home feed page to feel like a real streaming service.  
  **Prompt:** *“Help me build a Netflix-style homepage using Jikan top/season endpoints. I want a hero banner and multiple horizontal rows like ‘Trending Now’, ‘Season Now’, and a third row with fresh picks that doesn’t repeat items.”*  
  **Outcome:** Implemented `Discover` with a hero anime, `Row` component with scrollable carousels and arrow controls, and three distinct rows: “Trending Now”, “Season Now”, and “Top Picks for You”, using de-duplicated data from `/top/anime` and `/seasons/now`.

---

  **Tool:** ChatGPT  
  **Context/Goal:** Make `AnimeCard` feel richer on hover, similar to Netflix’s expanded preview.  
  **Prompt:** *“I need a reusable AnimeCard component that shows the poster normally, but on hover shows a gradient overlay with title, rating, season, episode count, synopsis preview, and buttons for play trailer + add/remove from My List.”*  
  **Outcome:** Built `AnimeCard` using `framer-motion` with a hover scale effect, gradient overlay, compact rating display, truncated synopsis, and icon row (play + bookmark) wired to Redux.

---

  **Tool:** ChatGPT  
  **Context/Goal:** Replace the old static banner on the details page with an embedded trailer that auto-plays, with a fallback to banner images.  
  **Prompt:** *“Help me build a `DetailPage` that uses `useGetAnimeByIdQuery`, extracts the YouTube trailer from the Jikan response, and shows it as an autoplaying hero video, falling back to banner/poster images if no trailer is available.”*  
  **Outcome:** Implemented trailer helpers (`getYoutubeId`, `buildTrailerUrl`), an `<iframe>` hero section with gradient text overlay, and robust image fallbacks for banner and poster while keeping performance and styling consistent.

---

  **Tool:** ChatGPT  
  **Context/Goal:** Implement a “My Lists” page showing a watchlist and simple history, with data persisted in `localStorage`.  
  **Prompt:** *“I want a My Lists page with tabs for WATCHLIST and HISTORY like Crunchyroll. It should read from Redux + localStorage, sort by most recently added, and render the same AnimeCard layout as SearchPage.”*  
  **Outcome:** Added `myListSlice` (with `hydrate`, `add`, `remove`, `toggle`, `clear`), a `MyListsPage` with tabs, grid layout for recent activity, and helper logic to load/save the watchlist state to `localStorage`.

---

  **Tool:** ChatGPT  
  **Context/Goal:** Ensure watchlist items show full details on hover, not just minimal data.  
  **Prompt:** *“My watchlist cards don’t show synopsis or other details. I’m only storing a small subset of fields in localStorage. How can I adjust the slice and toggle logic so saved entries contain enough data for AnimeCard to render the full overlay?”*  
  **Outcome:** Updated the `Saved` type in `myListSlice` to include more fields from `Anime` (synopsis, episodes, season, year, scored_by, favorites, trailer), and changed the bookmark toggle in `AnimeCard` to dispatch a richer payload so watchlist cards match the detail level of search results.

---

  **Tool:** ChatGPT  
  **Context/Goal:** Handle Jikan API rate limits and simplify recommendations.  
  **Prompt:** *“I’m getting 429 RateLimitException from Jikan because I’m fetching multiple `/full` endpoints for recommendations. Help me redesign the third row logic so it doesn’t spam the API but still feels like ‘Top Picks’.”*  
  **Outcome:** Removed the aggressive `getRecommendationsFull` query, stopped chaining many `/full` calls, and switched the third row to a de-duplicated combination of `/top/anime` and `/seasons/now` so it always uses rich list data without hitting rate limits.

---

- 
  **Tool:** ChatGPT  
  **Context/Goal:** Fine-tune trailer autoplay behaviour on the `DetailPage`.  
  **Prompt:** *“Point me to the exact lines that control autoplay + mute in the DetailPage trailer iframe. I want the trailer to attempt to play with sound instead of being forced muted.”*  
  **Outcome:** Identified the `buildTrailerUrl` helper and adjusted the query parameters (removing or changing `mute=1`) and kept the appropriate `allow="autoplay; encrypted-media; picture-in-picture"` attributes on the iframe while understanding browser autoplay limitations.


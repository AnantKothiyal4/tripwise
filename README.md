# TripWise - Smart Travel Planner 

Made a super mario type website as i feel normal websites are boring. You can search any city, explore tourist places, read details and build a "Quest Log" itinerary that survives a page refresh. TOOK HELP FROM AI BUT IT HAS MY EFFORTS TOO LOL

**Live demo:** https://tripwisemario.netlify.app/ | **Track:** Frontend

## Features
- Destination discovery from the Geoapify Places API (card grid, responsive)
- City search, category filters (Historic, Architecture, Nature, Museums, Landmarks), name filter, sorting (nearest / A-Z / Z-A)
- Details modal with Wikipedia description + photo, address, opening hours, website and map link
- Add / view / remove places in "My Trip"; saved in browser `localStorage`
- Loading (mushroom + progress flag), empty, and error states with retry
- Mobile-first responsive layout, keyboard focus styles, reduced-motion support

## Tech stack
React 18, Vite 5, Tailwind CSS 4, plain `fetch`, browser `localStorage`. No custom backend.

## APIs used
| API | Purpose | Key needed? |
|---|---|---|
| [Geoapify Geocoding](https://apidocs.geoapify.com/docs/geocoding/) | City name to coordinates | Yes (free tier) |
| [Geoapify Places](https://apidocs.geoapify.com/docs/places/) | Tourist places around a point | Yes (same key) |
| [Wikipedia REST summary](https://en.wikipedia.org/api/rest_v1/) | Place description + photo | No |

Attribution: Places by Geoapify, (c) OpenStreetMap contributors, text from Wikipedia (shown in the app footer).

## Setup
1. Install [Node.js](https://nodejs.org) (LTS).
2. `npm install`
3. Copy `.env.example` to `.env` and put your free key from https://myprojects.geoapify.com in `VITE_GEOAPIFY_KEY`.
4. `npm run dev` and open the printed `http://localhost:5173` link.

## Deploy (Netlify / Vercel)
Build command `npm run build`, output folder `dist`. Add the environment variable `VITE_GEOAPIFY_KEY` in the host's settings (never commit `.env`).
In the Geoapify dashboard, restrict your key to your deployed domain and `localhost`.

## Project structure
```
src/
  api/         geoapify.js, wikipedia.js   (all network calls)
  components/  Header, SearchBar, FilterBar, PlaceCard, PlaceModal, QuestLog, Loader, StateMessages, Sprites
  hooks/       useItinerary.js             (localStorage persistence)
  utils/       categories.js, format.js
  App.jsx      state + page layout
```

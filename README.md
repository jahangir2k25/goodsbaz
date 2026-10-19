# Elegance – MERN + Tailwind beauty store

Folders: `client/` (React + Vite + Tailwind) and `server/` (Node + Express + MongoDB).

## Run

You need Node 18+ and MongoDB (local, or a free Atlas cluster).

```bash
# 1) API
cd server
npm install
# edit .env if needed (MONGO_URI for Atlas)
npm run seed        # demo categories, brands, 52 products, banners, coupons, users
npm run dev         # http://localhost:5000

# 2) Website (new terminal)
cd client
npm install
npm run dev         # http://localhost:5173  (proxies /api -> :5000)
```

Logins after seeding:
- Admin: `admin@elegance.com` / `admin123`  → /admin
- Customer: `user@elegance.com` / `user123`
- Coupons: `WELCOME10` (10%, min ৳500), `ELEGANCE100` (৳100 off, min ৳1500)

## Customising
- Phone, address, social links, shipping fees: `client/src/config/site.js` (+ `server/.env` for the server-side shipping rules, which must match).
- Brand colour: `client/tailwind.config.js` → `colors.brand`.
- Google login: create a Google OAuth 2.0 Web client ID, add it as `VITE_GOOGLE_CLIENT_ID` in `client/.env` and `GOOGLE_CLIENT_ID` in `server/.env`, and allow your client origin (for example, `http://localhost:5173`) in the OAuth client configuration.
- Home page banners (hero slider, "Hot Deals" cards, 3 brand cards): Admin → Banners. Paste an Image URL to use your real artwork.
- Product photos: Admin → Products → image URLs (one per line). Until then a bottle placeholder is shown.

## API overview
`/api/home` · `/api/products` (filters: keyword, category, sub, brand, minPrice, maxPrice, offers, newArrival, sort, page) ·
`/api/categories` · `/api/brands` · `/api/banners` · `/api/coupons/validate` · `/api/orders` (+ `/my`, `/track`) · `/api/auth` · `/api/admin/stats`

Prices are always recalculated on the server at checkout (the browser cannot change them).

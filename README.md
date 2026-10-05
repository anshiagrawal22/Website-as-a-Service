# Website as a Service

A website-builder platform for creating and managing business websites. Users can create sites, choose from a catalogue of templates, edit their content and appearance, manage products, and publish a storefront. The app includes a React/Vite frontend and an Express/Prisma backend.

## Current features

- Account registration and sign-in with user-owned website workspaces.
- Public template catalogue with seven seeded starter designs for fashion, ceramics, creative portfolios, wineries, bakeries, interior design, and photography.
- Website editor with a live preview, responsive viewport modes, editable sections and navigation, color palettes, heading-font choices, and draft saving.
- Business details, contact information, social links, and logo uploads.
- Product catalogue management, including images, categories, inventory, visibility, and sorting.
- Draft and published site configurations, public storefront URLs, template switching, and configuration version history.
- Storefront checkout that creates pending orders, plus inquiry submission and owner-facing order/inquiry status management.
- Pricing information and custom-domain records.

Checkout currently records orders with a pending payment status; it does not capture payments through Stripe or Razorpay. Custom-domain records are supported, but DNS setup and domain provisioning are not automated. The platform is still under development; verify deployment and payment requirements before using it for production transactions.

## Technology

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** Prisma with SQLite by default
- **Authentication:** JWT bearer tokens and bcrypt password hashing
- **Uploads:** Multer-backed image storage in `backend/uploads`

## Requirements

- Node.js and npm
- A terminal in the repository root

## Setup

Install dependencies from the repository root:

```powershell
npm install --prefix backend
npm install --prefix frontend
```

Create the backend environment file:

```powershell
Copy-Item backend/.env.example backend/.env
```

The example uses a local SQLite database at `backend/prisma/dev.db` (Prisma resolves `file:./dev.db` relative to the schema). Set a unique `JWT_SECRET` before running outside local development.

Generate the Prisma client and create/update the local database:

```powershell
npm run prisma:generate --prefix backend
npm run prisma:push --prefix backend
```

To load the seven templates and pricing plans into a **new local database**, run:

```powershell
npm run prisma:seed --prefix backend
```

> **Warning:** Seeding clears and recreates application records, including users, sites, products, orders, and templates. Do not run it against a database whose contents you need to keep.

## Run locally

Open two terminals at the repository root:

```powershell
npm run server
```

```powershell
npm run frontend
```

The API listens on `http://localhost:5001` by default; the Vite frontend is available at `http://localhost:5173`. The frontend development server proxies `/api`, `/uploads`, and `/s/` requests to the backend. The API health endpoint is `http://localhost:5001/api/health`.

To create production builds for both applications:

```powershell
npm run build
```

To type-check the frontend:

```powershell
npm run lint --prefix frontend
```

## Main app pages

- `/` — workspace, website drafts and published websites
- `/templates` — browse templates
- `/manageinfo` — manage business information
- `/pricing` — view platform plans

The workspace requires an account. Public storefronts are served by the backend at `/s/:slug` for published websites.

## Configuration

Backend environment variables are documented in [`backend/.env.example`](./backend/.env.example):

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (defaults to `5001`) |
| `DATABASE_URL` | Prisma database connection; defaults to local SQLite |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `JWT_EXPIRES_IN` | Authentication token lifetime |
| `CORS_ORIGIN` | Frontend origin allowed by the API |
| `APP_URL` | Backend base URL used when constructing asset URLs |
| `UPLOADS_DIR` | Optional absolute path for uploaded files |
Set `VITE_API_URL` in the frontend environment only when the API is hosted at a non-default URL. When unset, the local Vite proxy is used in development.

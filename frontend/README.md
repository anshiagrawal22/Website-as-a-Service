# Website Builder Frontend

This folder contains the React 19 and TypeScript client for Website as a Service. It uses Vite for local development and production builds, Tailwind CSS for styling, and the Express API in `../backend` for account, website, template, product, upload, pricing, and storefront data.

## Run the client

Install dependencies from the repository root and start the API first:

```powershell
npm install --prefix frontend
npm run server
```

In another terminal at the repository root:

```powershell
npm run frontend
```

Vite serves the client at `http://localhost:5173` and proxies API and upload requests to the local backend at `http://localhost:5001`. See the root [README](../README.md) for database setup, environment variables, seeded data, and the full app feature overview.

## Scripts

Run these from the repository root:

```powershell
npm run lint --prefix frontend
npm run build --prefix frontend
npm run preview --prefix frontend
```

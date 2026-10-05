# Website as a Service

A website-builder platform for creating and managing business websites. Users can choose templates, customize their website, manage business information and products, and publish their storefront.

## Features

- User registration and sign-in
- Website workspace for managing drafts and published websites
- Template catalogue with seven business-focused templates
- Website editor with live preview and responsive views
- Editable website sections, navigation, colors, and fonts
- Business information and contact details management
- Logo and image uploads
- Product catalogue management
- Product images, categories, inventory, visibility, and sorting
- Draft and published website configurations
- Template switching
- Website configuration version history
- Public storefronts
- Basic checkout and order management
- Customer inquiry submission and inquiry management
- Pricing plans
- Custom-domain records

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** Prisma, SQLite
- **Authentication:** JWT, bcrypt
- **File Uploads:** Multer

## Requirements

- Node.js
- npm
- Git

## Setup

Clone the repository and install dependencies:

```powershell
npm install --prefix backend
npm install --prefix frontend
```

Create the backend environment file:

```powershell
Copy-Item backend/.env.example backend/.env
```

Generate Prisma client and set up the database:

```powershell
npm run prisma:generate --prefix backend
npm run prisma:push --prefix backend
```

For a new local database, seed the initial templates and pricing plans:

```powershell
npm run prisma:seed --prefix backend
```

## Run Locally

Start the backend:

```powershell
npm run server
```

Start the frontend in a separate terminal:

```powershell
npm run frontend
```

The application runs by default at:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5001`
- API Health: `http://localhost:5001/api/health`

## Build

Create production builds:

```powershell
npm run build
```

# Website-as-a-Service (WaaS) Platform & Storefront Engine

A modern, responsive multi-tenant SaaS website builder and e-commerce platform inspired by Shopify. Small business owners can design, customize, and publish professional storefronts with live previews, multi-currency cart & checkout, product inventory, and responsive industry-tailored templates.

---

## 🚀 Key Features

### 🎨 Live Website Builder & Visual Editor
- **Dynamic Live Canvas**: Interactive preview with real-time editing of typography, hero banners, story sections, and contact atelier info.
- **Responsive Viewport Switcher**: Instant live switching between **Desktop (100%)**, **Tablet (768px)**, and **Mobile (375px)** device modes.
- **Multi-Template Architecture**: 7 production-grade industry templates:
  - *Modern Fashion Store* (Retail & e-commerce apparel)
  - *Artisan Ceramics & Homeware* (Earth-toned craft store)
  - *Creative Portfolio* (High-contrast typography & project showcase)
  - *Weinhof Johannes Winery* (Rich burgundy tasting & vineyard heritage)
  - *Naturally Crafted Sourdough Bakery* (Warm crust tones & artisanal process)
  - *AURORA Luxury Interior Design* (Minimalist luxury & spatial design)
  - *Verdandi Photography Studio* (Atmospheric editorial gallery & packages)
- **Draft & Publish Engine**: Dual draft/published configurations with automated slug routing (`/s/:slug`), custom domains, and snapshot version history.

### 🛍️ Complete E-Commerce Layer
- **Add to Cart & Cart Drawer**: Slide-in cart drawer with variant selection, stock validation, promo code discounts, and tax/shipping computation.
- **Multi-Gateway Checkout**: Support for Cash on Delivery (COD), Stripe, and Razorpay with customer address management.
- **Order Management**: Dedicated order tracking pipeline (`pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`).
- **Product Catalog CRUD**: High-res image management, category tagging, stock alerts, and instant price adjustments.

### 🤖 AI Copywriting Assistant
- Integrated Google Gemini AI assistant to generate high-converting hero headlines, product descriptions, and brand stories in one click.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Motion
- **Backend**: Node.js, Express.js (TypeScript), Prisma ORM (SQLite / PostgreSQL), JWT, bcryptjs, Multer
- **Storefront Engine**: Server-rendered SSR engine with client-side interactive cart & checkout modals

---

## 💻 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dimple2001/Website-as-a-Service.git
   cd Website-as-a-Service
   ```

2. **Install dependencies:**
   ```bash
   # Install backend dependencies
   cd backend && npm install

   # Install frontend dependencies
   cd ../frontend && npm install
   ```

3. **Initialize Database & Seed Data:**
   ```bash
   cd backend
   cp .env.example .env
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
   ```

---

## 🏃 Running Locally

Run both frontend and backend concurrently from the root directory:

- **Start Backend API Server (Port 5001):**
  ```bash
  npm run server
  ```

- **Start Frontend Client Dev Server (Port 3000 / 5173):**
  ```bash
  npm run frontend
  ```

- **Or run both simultaneously:**
  ```bash
  # In terminal 1:
  npm run backend

  # In terminal 2:
  npm run frontend
  ```

---

## 🧪 Testing Public Storefronts
Once the backend is running, test any live published storefront directly at:
- `http://localhost:5001/s/aurelia-boutique`
- `http://localhost:5001/s/weinhof-johannes`
- `http://localhost:5001/s/naturally-crafted-sourdough`
- `http://localhost:5001/s/aurora-interior`
- `http://localhost:5001/s/verdandi-photography`
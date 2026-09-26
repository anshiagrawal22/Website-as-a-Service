# Website-as-a-Service (WaaS) Platform

A modern, responsive SaaS platform inspired by Shopify's user experience that enables small business owners to create, customize, and publish professional websites without any coding knowledge.

## Project Overview

Business owners can register an account, fill in basic business details, upload logos and product photos, select an industry-tailored website template, customize theme colors, and publish their website with an instant public URL.

## Key Features

- **Platform Landing Page:** High-converting landing page featuring a hero preview, key features, a 3-step process, an interactive template showcase, pricing tiers, and an FAQ accordion.
- **Authentication & Data Isolation:** Secure JWT authentication, password hashing with bcrypt, protected dashboard routing, and user data isolation.
- **Shopify-Inspired Admin Dashboard:** Sleek blue-themed admin dashboard with setup progress indicators, dynamic onboarding checklists, and quick store actions.
- **Business Details Form:** Divided form for store information, logo uploading, address, contact details, social links, and display preferences.
- **Products & Services Manager:** Full catalog CRUD management allowing owners to add, edit, and remove products/services with prices, descriptions, and images.
- **4 Distinct Website Templates:**
  - *Modern Fashion Store* (Retail & e-commerce)
  - *Restaurant & Cafe* (Menu highlights & table reservations)
  - *Beauty & Salon* (Treatment packages & appointment booking)
  - *Professional Corporate Portfolio* (Services matrix & consultation requests)
- **Real-Time Website Customizer:** Side-by-side theme color picker, section visibility toggles, URL slug editor, and Desktop/Tablet/Mobile live viewport switcher.
- **Automated Publishing Workflow:** Validation engine, compilation pipeline, status indicators (*Draft*, *Publishing*, *Published*, *Failed*), and live URL generation (`/site/:slug`).
- **Generated Customer Websites:** Responsive standalone websites equipped with interactive product quick views, direct WhatsApp ordering, and working customer inquiry forms.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons, React Router
- **Backend:** Node.js, Express.js, JWT, bcryptjs
- **Database:** MongoDB (Mongoose) with an automatic local persisted JSON database fallback engine for instant zero-config startup

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anshiagrawal22/Website-as-a-Service.git
   cd Website-as-a-Service
   ```

2. **Install dependencies:**
   - Server dependencies:
     ```bash
     cd server && npm install
     ```
   - Client dependencies:
     ```bash
     cd ../client && npm install
     ```

## Commands to Run

- **Start Backend API Server (Port 5000):**
  ```bash
  npm run server
  ```

- **Start Frontend Client Dev Server (Port 5173):**
  ```bash
  npm run client
  ```

- **Build Production Bundle:**
  ```bash
  npm run build
  ```

- **Run Production Application (Port 5000):**
  ```bash
  npm start
  ```
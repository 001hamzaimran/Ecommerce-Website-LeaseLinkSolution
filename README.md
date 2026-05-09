# 💎 LeaseLink Solution | Premium E-Commerce Marketplace

LeaseLink Solution is a high-end, full-stack e-commerce platform designed for premium retail. It features a sophisticated editorial aesthetic, advanced security protocols, and industry-leading SEO architecture.

![Hero Banner](https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200)

## 🚀 Key Features

- **Luxury Boutique UI**: Immersive product discovery with sticky sidebars, high-end display typography, and smooth micro-animations.
- **Dynamic Variant Engine**: A flexible system allowing admins to create custom variants (e.g., Material, Capacity, Flavor) for any product.
- **Multi-Image Galleries**: Support for high-resolution product carousels with multiple image uploads and external link support.
- **Global Wishlist (Favourites)**: Persistent user preferences saved via LocalStorage with dynamic header badges.
- **Smart Mega Menu**: Category-driven navigation with dynamic fetching for seamless browsing.
- **Admin Portal**: Comprehensive management suite for products, categories, and subcategories with strict field validation.

## 🛡️ Security Hardening (Pro Level)

The platform is built with a multi-layered security approach to protect API integrity and data privacy:

- **Payload Obfuscation**: All JSON API responses are Base64 masked to hide data schemas from casual browser inspection.
- **API Integrity Signatures**: A shared-secret signature system (`x-app-integrity`) that validates requests, preventing external tools (like Postman) from unauthorized data modification.
- **Custom Rate Limiting**: IP-based request throttling to prevent DDoS and automated scraping bots.
- **Security Headers**: Manual implementation of `X-Frame-Options`, `X-XSS-Protection`, and `Content-Security-Policy` for hardened browser defense.

## 📈 SEO & Performance Architecture

Optimized for high-velocity indexing and "Rich Result" visibility:

- **JSON-LD Structured Data**: Full implementation of Schema.org (Product, Organization, Website) for star ratings and price snippets in Google search.
- **Core Web Vitals**: Smart image loading (`eager` for hero, `lazy` for gallery) to maximize LCP and page speed.
- **Dynamic Meta Tags**: Automated SEO management for every product and category page via `react-helmet-async`.
- **Sitemap & Robots**: Automated generation of `sitemap.xml` and `robots.txt` for efficient search engine crawling.

## 💻 Tech Stack

**Frontend:**
- React (Vite)
- Framer Motion (Animations)
- TanStack Query (State & Fetching)
- Lucide React (Iconography)
- Radix UI / Shadcn (Components)
- Tailwind CSS (Styling)

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- JWT & Bcrypt (Architecture Ready)
- Custom Security Middleware

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/001hamzaimran/Ecommerce-Website.git
   ```

2. **Server Setup:**
   ```bash
   cd Server
   npm install
   # Configure .env with MONGO_URI and API_INTEGRITY_SECRET
   npm start
   ```

3. **Client Setup:**
   ```bash
   cd client
   npm install
   # Configure .env with VITE_API_URL and VITE_API_INTEGRITY_SECRET
   npm run dev
   ```

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ .

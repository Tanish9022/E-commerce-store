# Kiro - Premium Custom Streetwear Architecture

## 1. Full Architecture Design

The application follows a modern decoupled monolith architecture using **Next.js 16 (App Router)** as the core framework. 

*   **Frontend (Client):** React 19 Server Components for SEO and fast initial load, mixed with Client Components for heavy interactivity (Canvas editor, GSAP animations). State management handled via React Context/Zustand (for Cart) and LocalStorage.
*   **Backend (API Routes):** Serverless Next.js API Routes handling authentication, product retrieval, cart synchronization, and checkout processes.
*   **Database:** MongoDB Atlas accessed via Mongoose ORM.
*   **Media Storage:** Cloudinary for robust image transformations, optimization, and delivery via CDN.
*   **Payments:** Stripe for PCI-compliant checkout sessions and webhook-based order fulfillment.

## 2. Component Hierarchy

```text
App (RootLayout)
├── Providers (CartProvider, AuthProvider, ToastProvider)
├── Navbar (Global)
├── Page (Home)
│   ├── HeroAnimation (Canvas + GSAP)
│   ├── FeatureGrid
│   └── ProductShowcase
├── Shop
│   ├── Filters Sidebar
│   └── ProductGrid
│       └── ProductCard (Hover states, Quick View)
├── Product Detail
│   ├── ImageGallery
│   ├── ProductInfo
│   └── CustomizationEditor (Client)
│       ├── Canvas Area (Fabric.js / Konva)
│       ├── Tool Panel (Text, Upload, Color, Size)
│       └── LivePreview
├── CartDrawer (Slide-out or separate page)
│   ├── CartItemList
│   └── CheckoutSummary
└── Footer (Global)
```

## 3. Frontend Folder Structure

```text
/app
  /(storefront)
    /page.tsx               # Landing page
    /shop/page.tsx          # Product catalog
    /products/[id]/page.tsx # Product details
    /cart/page.tsx          # Cart page
    /customize/page.tsx     # Fullscreen editor
  /(auth)
    /login/page.tsx
    /register/page.tsx
  /(dashboard)
    /user/page.tsx          # User order history
    /admin/page.tsx         # Admin dashboard
/components
  /ui                       # Reusable base components (Buttons, Inputs)
  /layout                   # Navbar, Footer, Section wrappers
  /shop                     # ProductCard, Grid, Filters
  /editor                   # Customization tools (Fabric/Konva wrappers)
  /animation                # HeroAnimation, ParallaxWrappers
/lib
  /mongodb.ts               # Database connection
  /stripe.ts                # Stripe client
  /cloudinary.ts            # Cloudinary upload/fetch utils
  /utils.ts                 # Tailwind cn() merge, formatting
/hooks
  /useCart.ts
  /useAuth.ts
/context
  /CartContext.tsx
/public
  /frames                   # WebP scroll animation sequences
  /assets                   # Static branding
```

## 4. Backend API Structure

Located under `/app/api/`:

*   **`/api/auth/`**
    *   `POST /register`: Hash password (bcrypt), create user.
    *   `POST /login`: Verify credentials, set JWT in HttpOnly cookie.
    *   `POST /logout`: Clear cookie.
    *   `GET /me`: Return current user profile from token.
*   **`/api/products/`**
    *   `GET /`: Fetch all products (with pagination/filtering).
    *   `GET /[id]`: Fetch single product details.
    *   *(Admin)* `POST /`: Create product.
    *   *(Admin)* `PUT /[id]`: Update product.
    *   *(Admin)* `DELETE /[id]`: Remove product.
*   **`/api/orders/`**
    *   `GET /`: Fetch user's orders.
    *   `POST /`: Create pending order (triggered before Stripe redirect).
    *   *(Admin)* `GET /all`: Fetch all system orders.
    *   *(Admin)* `PUT /[id]`: Update order status (Processing, Shipped).
*   **`/api/checkout/`**
    *   `POST /session`: Generate Stripe Checkout Session URL.
    *   `POST /webhook`: Stripe webhook handler to finalize order payment status.
*   **`/api/upload/`**
    *   `POST /`: Generate Cloudinary signature for secure direct-to-cloud uploads.

## 5. Database Schema (Mongoose)

**User Model:**
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hashed
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
}
```

**Product Model:**
```javascript
{
  name: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true },
  images: [{ url: String, altId: String }], // Cloudinary URLs
  category: String,
  availableSizes: [String], // e.g., ['S', 'M', 'L', 'XL']
  stock: Number,
  createdAt: { type: Date, default: Date.now }
}
```

**Order Model:**
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    size: String,
    priceAtTime: Number,
    customizationData: {
      designUrl: String, // Final rendered canvas uploaded to Cloudinary
      metadata: Object   // Coordinates, text layers (for reproduction)
    }
  }],
  totalAmount: Number,
  stripeSessionId: String,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'] },
  orderStatus: { type: String, enum: ['processing', 'printing', 'shipped', 'delivered'] },
  createdAt: { type: Date, default: Date.now }
}
```

## 6. Tailwind Design System

*   **Colors:**
    *   `background`: `#000000` (Pure Black)
    *   `foreground`: `#ffffff` (White)
    *   `accent`: `#39FF14` (Neon Green - Brand Color)
    *   `zinc-900`/`zinc-950`: Used for surface elevation and cards.
*   **Typography:**
    *   `font-family`: Inter (sans-serif) or SF Pro fallback.
    *   `headings`: Ultra-bold (`font-black`), negative tracking (`tracking-tighter`), uppercase.
    *   `body`: Light weight (`font-light`), wide tracking.
*   **Spacing & Layout:**
    *   Massive padding for sections (`py-32`, `py-40`).
    *   Max-width containers (`max-w-7xl`) to keep content centered on ultra-wide screens.
*   **Effects:**
    *   `.text-glow`: Custom text shadow utilizing the neon accent.
    *   `.glass-card`: `backdrop-blur` over semi-transparent backgrounds.
    *   `.ease-apple`: Custom cubic-bezier transition (`cubic-bezier(0.65, 0, 0.35, 1)`).

## 7. Animation Implementation Strategy

**Hero Frame Sequence (GSAP ScrollTrigger):**
1.  **Preparation:** Convert video to 150-200 `.webp` frames to save bandwidth.
2.  **Preloading:** First 1-5 frames preload instantly to ensure immediate visual feedback. Remaining frames lazy-load asynchronously via JavaScript `new Image()`.
3.  **Rendering Engine:** `HTMLCanvasElement` utilizing `requestAnimationFrame` and `clearRect/drawImage`. This is vastly more performant than manipulating DOM elements (`<img src>`).
4.  **Scroll Binding:** GSAP `ScrollTrigger` mapped to a pinned container (`end: "+=300%"`). As the user scrolls, the scroll progress maps directly to the integer index of the frame array.
5.  **Fallback:** CSS spinners show while the initial sequence loads, avoiding blank black screens.

**Micro-interactions:**
*   CSS `transform: scale()` on hover for product cards.
*   Opacity fades for background imagery.
*   Smooth, easing-based cursor following (optional, standard in premium sites).

## 8. Admin Dashboard Structure

The Admin area (`/app/admin`) will be protected by middleware ensuring `role === 'admin'`.

**Layout:**
*   **Sidebar:** Navigation (Overview, Products, Orders, Users, Settings).
*   **Header:** Quick stats, Admin profile.

**Key Views:**
1.  **Overview:** High-level metrics (Total Revenue, Pending Orders, Low Stock Alerts).
2.  **Product Manager:** Data table of products. Modal/Page for creating/editing products, including a dropzone for Cloudinary image uploads.
3.  **Order Manager:** Kanban-style or detailed list view to track orders from `Paid` -> `Printing` -> `Shipped`. Ability to view the user's `designUrl` to fulfill the physical printing.
4.  **Inventory:** Quick inline-editing of stock numbers.
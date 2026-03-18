# PRD — Custom Clothing Printing Ecommerce Website

Version: 1.0
Status: Development Specification

---

# 1. Product Overview

The platform is a **Gen-Z focused ecommerce website** where users can purchase customizable clothing.

Customers will be able to:

* Browse clothing products
* Customize prints on clothing
* Upload their own designs
* Add custom text
* Purchase products securely
* Track order history

The website will include a **cinematic scroll animation landing page**, similar to premium product sites.

Instead of real-time 3D rendering, the landing animation will use **scroll-controlled video frame sequences**.

---

# 2. Product Goals

## Business Goals

1. Sell customizable clothing products online.
2. Create a modern brand experience.
3. Provide seamless checkout.
4. Allow easy order management for admins.

## Technical Goals

1. Page load time under **3 seconds**.
2. Smooth scroll animation.
3. Secure authentication system.
4. Scalable ecommerce backend.
5. Modular architecture for future features.

---

# 3. Target Users

### Customers

Users purchasing customizable clothing.

### Admin

Business owner managing products and orders.

---

# 4. User Roles

## Guest

Permissions:

* View landing page
* Browse products
* Customize preview

Restrictions:

* Cannot checkout without account.

---

## Registered User

Permissions:

* Login / logout
* Customize products
* Add items to cart
* Checkout
* View order history

---

## Admin

Permissions:

* Access admin dashboard
* Add products
* Edit products
* Delete products
* Manage orders

---

# 5. Core Features

## Landing Page

Features:

* Scroll-controlled animation
* Cinematic product presentation
* Minimal UI
* Product highlight sections
* Call-to-action buttons

---

## Shop Page

Features:

* Product grid
* Category filters
* Product cards
* Hover animations

---

## Product Page

Features:

* Product images
* Size selection
* Customization editor
* Price display
* Add-to-cart button

---

## Customization Editor

Users must be able to:

* Upload design image
* Add custom text
* Change font
* Change color
* Resize design
* Drag and position elements

Live preview required.

---

## Cart System

Features:

* Product list
* Quantity update
* Remove items
* Price summary
* Checkout button

---

## Authentication System

Pages:

Login
Register

Passwords must be encrypted.

---

## User Dashboard

Features:

* Order history
* Order status tracking
* Custom design preview

---

## Admin Dashboard

Admin capabilities:

* Add products
* Edit products
* Delete products
* Manage inventory
* View orders
* Update order status

---

# 6. Landing Animation System

The landing hero animation will be implemented using **video frame sequences**.

## Video Requirements

Duration: 8–10 seconds
Resolution: 4K recommended
Aspect ratio: 16:9
Frame rate: 24 fps

---

## Frame Extraction

Video must be converted into frames.

Example:

```
/public/frames
frame001.webp
frame002.webp
frame003.webp
```

Recommended frames:

150–200 frames

Images must be WebP.

---

## Scroll Mapping

Scroll progress determines displayed frame.

Example:

0% scroll → frame 1
50% scroll → frame 100
100% scroll → frame 200

Animation must feel smooth.

---

# 7. Technology Stack

Frontend:

Next.js (App Router)
Tailwind CSS
GSAP ScrollTrigger

Backend:

Next.js API routes
MongoDB
Mongoose
JWT authentication
bcrypt password hashing

Payments:

Stripe

Media storage:

Cloudinary

---

# 8. Database Schema

## User

```
_id
name
email
password
role
createdAt
```

---

## Product

```
_id
name
description
price
images[]
sizes[]
stock
category
createdAt
```

---

## Order

```
_id
userId
products[]
customizationData
totalAmount
stripeSessionId
paymentStatus
orderStatus
createdAt
```

---

# 9. Security Requirements

Passwords hashed using bcrypt
JWT authentication tokens
HTTP-only cookies
Stripe webhook verification

---

# 10. Deployment

Hosting: Vercel
Database: MongoDB Atlas
Media: Cloudinary
Payments: Stripe

---

# 11. Development Phases

Phase 1 — Project Setup
Phase 2 — Core Pages
Phase 3 — Customization System
Phase 4 — Ecommerce Backend
Phase 5 — Admin Dashboard
Phase 6 — Landing Animation
Phase 7 — Testing & Optimization

---

# 12. Success Criteria

The project is successful if:

* Users can customize clothing.
* Orders process successfully.
* Admin manages products.
* Landing animation performs smoothly.

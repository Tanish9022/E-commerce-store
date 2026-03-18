# DESIGN.md — Frontend & Backend Architecture

---

# 1. Design Philosophy

The website must follow a **premium minimal design approach**, similar to modern product marketing websites.

Key principles:

* Minimal UI
* Large product visuals
* Smooth motion
* High spacing
* Elegant typography

Design should feel:

Clean
Modern
Premium
Interactive

---

# 2. Visual Design System

## Color Palette

Primary background:

Black or dark gray

Accent color:

Neon green / brand color

Text colors:

White
Light gray

---

## Typography

Primary font:

Modern sans serif

Examples:

Inter
SF Pro style
Helvetica style

Headings:

Large bold titles.

Body text:

Light weight minimal style.

---

# 3. Layout System

The layout must use **large sections** similar to Apple product pages.

Structure:

Hero Section
Feature Section
Product Showcase
Customization Section
Shop Section
Footer

Each section should fill most of the viewport.

---

# 4. Landing Hero Design

Hero must contain:

Full-screen scroll animation
Centered product
Glow or lighting effect
Minimal text

Example structure:

```
Navbar
Hero animation
Headline
Shop button
```

---

# 5. Product Card Design

Each card must include:

Product image
Product name
Price
Hover animation

Cards should feel modern and spacious.

---

# 6. Customization UI

Customization editor must include:

Design canvas
Upload image button
Text editor
Font selector
Color picker
Size controls
Drag positioning

Preview must update in real time.

---

# 7. Motion Design

Animations must use smooth easing.

Examples:

Fade in
Parallax scrolling
Image reveal
Hover scale effects

Scrolling animation must feel cinematic.

---

# 8. Frontend Architecture

Framework:

Next.js

Main structure:

```
/app
/components
/lib
/styles
/public
```

Key components:

Navbar
HeroAnimation
ProductGrid
CustomizationEditor
CartPanel
Footer

---

# 9. Backend Architecture

Backend will use **Next.js API routes**.

Folder example:

```
/app/api
/products
/orders
/auth
/checkout
```

Responsibilities:

Auth API → login/register
Product API → CRUD operations
Order API → order storage
Checkout API → Stripe session

---

# 10. Payment System

Stripe Checkout flow:

User clicks checkout
Server creates session
User redirected to Stripe
Stripe confirms payment
Webhook verifies payment
Order stored in database

---

# 11. Media Storage

All images stored in:

Cloudinary

Used for:

Product images
Uploaded designs

---

# 12. Performance Strategy

Frames must be:

WebP
Lazy loaded
Compressed

Initial load must only include first frames.

---

# 13. Mobile Design

Mobile must include:

Simplified animation
Stacked layouts
Touch friendly UI

Scroll animation may be reduced on mobile.

---

# 14. Future Expansion

Possible future features:

AI design generator
AR clothing preview
Influencer storefronts
Customer reviews

---

# End of Design Document

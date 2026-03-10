# KIRO — Cinematic Custom Streetwear E-commerce

KIRO is a high-performance, visually immersive e-commerce platform built with **Next.js 16**, **Fabric.js**, and **Razorpay**. It features a real-time 2D customization studio, cinematic animations, and a robust administrative backend for managing custom streetwear drops.

## 🚀 Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Customization Engine:** Fabric.js (Canvas API)
- **State Management:** Zustand
- **Backend:** Next.js API Routes, MongoDB (Mongoose)
- **Authentication:** JWT with Cookie-based Middleware
- **Payments:** Razorpay Orders & Webhooks
- **Storage:** Cloudinary (Product & Design Uploads)
- **Icons:** Lucide React

## ✨ Key Features

- **2D Design Studio:** Real-time garment customization with text, shapes, and image uploads.
- **Cinematic UI:** High-fidelity animations and a dark-mode-first "Cyber" aesthetic.
- **Dynamic Shop:** Filterable product catalog with detailed product views.
- **Secure Checkout:** Full Razorpay integration with automated order creation via webhooks.
- **User Dashboard:** Order tracking and deployment history for customers.
- **Admin Panel:** Comprehensive management suite for orders and product listings.

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd movie
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and fill in your credentials:
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Deployment
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📦 Production & Deployment

### Build the Project
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Vercel
The easiest way to deploy is using the Vercel CLI or linking your GitHub repository to Vercel. Ensure you add all environment variables in the Vercel project settings.

```bash
vercel
```

## 🧪 Deployment Checklist

- [ ] Ensure `MONGODB_URI` is whitelisted for your production IP.
- [ ] Configure Razorpay Webhook URL to point to `https://your-domain.com/api/checkout/webhook`.
- [ ] Set `NODE_ENV` to `production`.

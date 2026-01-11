# 🚗 ArihantCars - Premium Certified Used Cars Nagpur

ArihantCars is a high-performance, production-ready web application for a premium pre-owned car dealership based in Nagpur. Built with the MERN stack (MongoDB, Express, React/Next.js, Node), it features a dynamic inventory, advanced search/filtering, and a powerful admin panel.

## ✨ Key Features

- **🎯 Advanced SEO**: Dynamic metadata, JSON-LD structured data for car snippets, and optimized image alt tags for maximum search visibility in the Nagpur market.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop with a premium, modern UI.
- **🔍 Smart Search & Filtering**: Filter cars by brand, price range, body type, and fuel type. Search by model name or brand.
- **🛠️ Admin Panel**: Secure dashboard to manage inventory (CRUD), update site configurations (contact info, address), and view customer inquiries.
- **🛡️ Production Ready**: Integrated security measures including Helmet.js, rate limiting, and CORS protection.
- **🖼️ Image Optimization**: Connected to Cloudinary for high-speed, optimized image delivery.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS, Axios, React Icons, React Hot Toast.
- **Backend**: Node.js, Express.js, Mongoose (MongoDB).
- **Storage**: Cloudinary (Image Hosting).
- **Security**: Helmet, Express-Rate-Limit, Morgan (Logging).

## 🛠️ Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the Repository
```bash
git clone https://github.com/ABHISHEKASHTANKAR/ArihantCars.git
cd ArihantCars
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=daxpg6fub
CLOUDINARY_API_KEY=768656157143491
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=http://localhost:3000
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env.local` file in the `frontend` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Run the frontend:
```bash
npm run dev
```

## 📜 Deployment

- **Backend**: Recommended to deploy on [Render](https://render.com).
- **Frontend**: Recommended to deploy on [Vercel](https://vercel.com).
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

## 📝 License
This project is private and intended for ArihantCars Nagpur.

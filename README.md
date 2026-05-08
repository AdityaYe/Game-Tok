# GameTok

GameTok is a full-stack short-form gaming content platform inspired by TikTok, YouTube Shorts, and Instagram Reels, built specifically for gameplay discovery and creator-driven content.

The platform enables creators to upload gameplay clips while users consume content through a high-performance vertical autoplay feed with real-time social interactions and game metadata integration.

Built using a scalable MERN-stack architecture with cloud-based media delivery and external API integrations.

---

# Features

## Authentication & Authorization

- JWT-based authentication
- Secure HTTP-only cookie sessions
- Role-based access control
- Protected routes & middleware

---

## Video Feed System

- TikTok-style vertical autoplay feed
- Infinite scroll architecture
- IntersectionObserver-based smart playback
- Mobile-first responsive design
- Optimized media rendering

---

## Creator Platform

- Creator dashboard
- Gameplay clip uploads & management
- Metadata editing & deletion
- Creator analytics:
  - Total uploads
  - Total likes
  - Total saves

---

## Social Features

- Like & save system
- Dynamic comments module
- Real-time engagement updates
- Creator verification badges

---

## Game Metadata Integration

- IGDB-powered game search
- Dynamic metadata fetching
- Game cover art & genre support
- MongoDB caching layer for optimized API usage

---

## Media Infrastructure

- Cloudinary-based media hosting
- Streaming uploads
- Optimized cloud media delivery
- Scalable storage architecture

---

# Tech Stack

## Frontend

- React
- React Router
- Axios
- CSS Modules

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer

## APIs & Services

- IGDB API
- Twitch OAuth
- Cloudinary

---

# Architecture Overview

```txt
React Frontend
      ↓
Express.js REST API
      ↓
JWT Authentication Layer
      ↓
MongoDB Database
      ↓
Cloudinary Media Storage
      ↓
IGDB / Twitch APIs
```

---

# Performance Optimizations

- Lazy-loaded media rendering
- Metadata caching architecture
- Optimized API request handling
- Reduced unnecessary re-renders
- Mobile-first performance tuning

---

# Roadmap

- Redis caching integration
- WebSocket-based real-time updates
- Dockerized deployment pipeline
- AI-powered content recommendations
- Scalable microservices migration

---

# Local Setup

## Clone Repository

```bash
git clone <repo-url>
cd gametok
```

## Install Dependencies

```bash
# frontend
cd client
npm install

# backend
cd server
npm install
```

---

# Environment Variables

```env
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
IGDB_CLIENT_ID=
IGDB_CLIENT_SECRET=
```

---

# Run Development Server

```bash
# frontend
npm run dev

# backend
npm start
```

---

# Vision

GameTok is designed as a scalable gaming-focused short-form content ecosystem combining creator tools, gameplay discovery, and modern social-media interaction patterns into a dedicated platform for gaming communities.

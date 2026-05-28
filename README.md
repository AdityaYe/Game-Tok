# GameTok

GameTok is a full-stack short-form gaming content platform inspired by TikTok, Instagram Reels, and YouTube Shorts.

Built specifically for gameplay creators and gaming communities, the platform focuses on immersive fullscreen gameplay feeds, creator-driven content, social interactions, and game discovery powered by IGDB integration.

---

# Features

## Authentication

* JWT authentication
* Secure HTTP-only cookie sessions
* Protected routes & middleware

---

## Fullscreen Gameplay Feed

* TikTok-style vertical feed
* Smart autoplay system
* Snap scrolling experience
* Dynamic support for:

  * landscape gameplay
  * portrait gameplay
* Cinematic fading UI system
* Mobile-first responsive experience

---

## Video Interactions

* Tap to pause/play
* Double tap to like
* Save/bookmark clips
* Dynamic comments system
* Persistent playback state
* Optimized fullscreen playback

---

## Creator Profiles

* Custom creator profiles
* Profile banners & avatars
* Follow system
* Social links integration
* Upload statistics

---

## Search & Discovery

* Search by:

  * usernames
  * games
  * tags
  * clips
* Explore-style clip discovery grid
* Fullscreen clip viewing from search
* Dynamic creator filtering

---

## Game Metadata System

* IGDB-powered game search
* Dynamic game recommendations
* Game cover integration
* MongoDB caching layer for optimized API usage

---

## Following Feed

* Dedicated following feed
* Creator-based clip filtering
* Curved cinematic creator selector
* Floating overlay navigation system

---

## Media Infrastructure

* Cloudinary media hosting
* Streaming uploads
* Optimized media delivery
* Thumbnail generation

---

# Tech Stack

## Frontend

* React
* React Router
* React Query
* Axios
* Zustand

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT

---

## APIs & Services

* IGDB API
* Twitch OAuth
* Cloudinary

---

# Architecture Overview

```txt
React Frontend
      ↓
Express.js REST API
      ↓
JWT Authentication
      ↓
MongoDB Database
      ↓
Cloudinary Media Storage
      ↓
IGDB / Twitch APIs
```

---

# Performance Optimizations

* Lazy-loaded video rendering
* Smart viewport playback
* Metadata caching
* Optimized rerender handling
* GPU-friendly UI transitions

---

# Local Setup

## Clone Repository

```bash
git clone <repo-url>
cd gametok
```

---

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

TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=
```

---

# Run Development Server

## Frontend

```bash
npm run dev
```

## Backend

```bash
npm run dev
```

---

# Vision

GameTok is designed as a gaming-focused short-form content ecosystem combining immersive gameplay discovery, creator tools, and modern social-media interaction patterns into a dedicated platform for gaming communities.

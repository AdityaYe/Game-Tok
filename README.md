# GameTok

GameTok is a full-stack short-form gaming content platform inspired by TikTok, Instagram Reels, YouTube Shorts, and modern gaming discovery platforms.

Built specifically for gameplay creators and gaming communities, GameTok combines immersive fullscreen clip feeds, creator-focused social systems, game metadata integration, and premium cinematic UI interactions into a dedicated gaming-first social media experience.

The platform enables:

* creators to upload and manage gameplay clips
* users to discover gaming content through intelligent feeds
* social interaction through follows, likes, saves, comments, and notifications
* game discovery powered by IGDB integration

Built using a scalable MERN-stack architecture with optimized media delivery, cloud storage infrastructure, and API-driven game metadata systems.

---

# Features

## Authentication & Authorization

* JWT-based authentication
* Secure HTTP-only cookie sessions
* Protected routes & middleware
* Persistent login sessions
* Creator-based account system

---

# Immersive Clip Feed

## Fullscreen Gameplay Feed

* TikTok-style vertical scrolling feed
* Snap-based immersive navigation
* Smart autoplay using IntersectionObserver
* Dynamic video scaling for both:

  * landscape gameplay
  * portrait gameplay
* Cinematic UI fade system
* Adaptive overlay visibility
* Mobile-first interaction architecture

---

## Advanced Video Interactions

* Tap to pause/play
* Double tap to like
* Persistent playback state
* Dynamic mute/unmute system
* Fade-in interaction controls
* Auto-dimming overlay UI for long-form clips
* Optimized fullscreen playback experience

---

# Creator & Social Platform

## Creator Profiles

* Custom creator profiles
* Dynamic profile banners
* Avatar system
* Bio & social links
* Follow / unfollow system
* Upload statistics:

  * Followers
  * Following
  * Uploads

---

## Social Features

* Like system
* Save/bookmark system
* Dynamic comment system
* Creator moderation controls
* Real-time engagement updates
* Notification architecture
* Verification badges

---

## Comment System

* Instagram/TikTok-inspired UI
* Mobile bottom-sheet comments
* Desktop side-panel comments
* Persistent open-state interactions
* Creator comment moderation
* User-owned comment deletion

---

# Gaming Metadata System

## IGDB Integration

* Real-time game search
* Game recommendations while uploading clips
* Game cover integration
* Metadata caching layer
* Optimized API usage through MongoDB persistence

---

## Smart Game Search

* Dynamic game suggestions
* IGDB-powered metadata retrieval
* Cover art generation
* Cached game database
* Optimized repeated search performance

---

# Search & Discovery System

## Multi-Filter Search Experience

Search supports:

* Usernames
* Games
* Tags
* Clips

---

## Explore-Style Clip Discovery

* Instagram/Pinterest-inspired clip grid
* Dynamic clip previews
* Full-width gameplay preservation
* Masonry-style adaptive layouts
* Fullscreen clip opening from search

---

## Intelligent Feed Filtering

* Filter clips by:

  * creator
  * game
  * tags
* Dedicated creator feeds
* Related clip browsing

---

# Following Feed System

## Cinematic Following Feed

Dedicated following feed with:

* fullscreen immersive clips
* followed creators only
* chronological creator uploads

---

## Curved Creator Selector

Custom floating creator selector featuring:

* curved wheel-style avatar scrolling
* cinematic overlay interactions
* dynamic creator focus states
* active creator capsules
* gesture-based hide/reveal system

---

# Media Infrastructure

## Cloudinary Media Pipeline

* Cloudinary-based media hosting
* Optimized media delivery
* Streaming uploads
* Thumbnail generation
* Responsive asset optimization

---

## Video Performance Optimizations

* Lazy-loaded playback
* Smart autoplay management
* Optimized rerender handling
* Mobile GPU-friendly transitions
* Reduced interaction-based playback interruptions

---

# Tech Stack

## Frontend

* React
* React Router
* React Query
* Axios
* Zustand
* React Icons
* CSS Modules / Custom CSS

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Multer

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
JWT Authentication Layer
      ↓
MongoDB Database
      ↓
Cloudinary Media Infrastructure
      ↓
IGDB / Twitch APIs
```

---

# Performance Optimizations

* Lazy-loaded video rendering
* Smart viewport playback detection
* MongoDB metadata caching
* Reduced unnecessary rerenders
* Optimized fullscreen feed architecture
* GPU-friendly UI transitions
* Dynamic media optimization
* Mobile-first performance tuning

---

# UI / UX Highlights

* Cinematic fullscreen feed
* Gaming-focused design language
* Adaptive overlay fading
* Immersive interaction system
* Responsive multi-device experience
* Console-inspired creator navigation
* Modern social-media interaction patterns

---

# Roadmap

* Redis caching integration
* WebSocket real-time notifications
* AI-powered recommendations
* Personalized gaming feeds
* Watch history system
* Creator analytics dashboard
* Advanced moderation tools
* Dockerized deployment pipeline
* Microservices architecture migration

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

GameTok is designed as a dedicated gaming-first short-form content ecosystem combining:

* creator tools
* immersive gameplay discovery
* cinematic content consumption
* intelligent game metadata systems
* modern social-media interaction patterns

into a scalable platform built specifically for gaming communities and gameplay creators.

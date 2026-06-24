<div align="center">

# 🎬 StreamVault Backend

**A robust, production-ready REST API for a full-featured video streaming platform**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#-api-reference)
- [Data Models](#-data-models)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌐 Overview

StreamVault Backend is the server-side engine powering a YouTube-like video streaming platform. It exposes a secure, RESTful API that handles everything from user authentication and video management to community features like comments, likes, playlists, subscriptions, and tweets. Built with scalability and clean architecture in mind, it uses MongoDB for persistence and Cloudinary for media delivery.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure access and refresh token flow with HTTP-only cookies
- 📹 **Video Management** — Upload, publish, update, delete, and paginate videos via Cloudinary
- 👤 **User Profiles** — Avatar & cover image uploads, watch history, channel statistics
- 💬 **Comments** — Nested comments on videos with full CRUD support
- ❤️ **Likes** — Like/unlike videos, comments, and tweets
- 📂 **Playlists** — Create and manage personal video playlists
- 🔔 **Subscriptions** — Subscribe/unsubscribe to channels; fetch subscriber & subscription lists
- 🐦 **Tweets** — Short community posts with like support
- 📊 **Dashboard** — Aggregated channel stats (views, subscribers, videos, likes)
- 🏥 **Healthcheck** — Endpoint for uptime monitoring and deployment checks
- ☁️ **Cloud Media** — All images and videos managed through Cloudinary
- 🧹 **Code Quality** — Enforced with Prettier for consistent style

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JSON Web Tokens (JWT) + Bcrypt |
| File Handling | Multer (local buffer) → Cloudinary |
| Pagination | mongoose-aggregate-paginate-v2 |
| Config | dotenv |
| Cross-Origin | CORS + Cookie-Parser |
| Dev Tooling | Nodemon, Prettier |

---

## 📁 Project Structure

```
streamvault-backend/
├── src/
│   ├── index.js                  # Entry point — connects DB & starts server
│   ├── app.js                    # Express app setup, middleware, routes
│   ├── constants.js              # App-wide constants (DB name, enums, etc.)
│   │
│   ├── controllers/              # Route handler logic (one file per resource)
│   │   ├── user.controller.js
│   │   ├── video.controller.js
│   │   ├── comment.controller.js
│   │   ├── like.controller.js
│   │   ├── playlist.controller.js
│   │   ├── subscription.controller.js
│   │   ├── tweet.controller.js
│   │   ├── dashboard.controller.js
│   │   └── healthcheck.controller.js
│   │
│   ├── models/                   # Mongoose schemas & models
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── playlist.model.js
│   │   ├── subscription.model.js
│   │   └── tweet.model.js
│   │
│   ├── routes/                   # Express routers (one file per resource)
│   │   ├── user.routes.js
│   │   ├── video.routes.js
│   │   ├── comment.routes.js
│   │   ├── like.routes.js
│   │   ├── playlist.routes.js
│   │   ├── subscription.routes.js
│   │   ├── tweet.routes.js
│   │   ├── dashboard.routes.js
│   │   └── healthcheck.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT verification middleware
│   │   └── multer.middleware.js  # File upload middleware (disk storage)
│   │
│   ├── db/
│   │   └── index.js              # MongoDB connection via Mongoose
│   │
│   └── utils/
│       ├── ApiError.js           # Custom error class with status codes
│       ├── ApiResponse.js        # Standardised success response wrapper
│       ├── asyncHandler.js       # try/catch wrapper for async controllers
│       └── cloudinary.js         # Upload & delete helpers for Cloudinary
│
├── .prettierrc                   # Prettier configuration
├── .prettierignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed and available:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A running [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- A [Cloudinary](https://cloudinary.com/) account (free tier works)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/DIGVIJAY-TRIPATHY/STREAMVAULT-BACKEND.git
cd streamvault-backend

# 2. Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root. Use the table below as a reference:

```env
# Server
PORT=8000

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=http://localhost:3000
```

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on |
| `MONGODB_URI` | Full MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | Secret for signing access JWTs |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime (e.g. `1d`, `15m`) |
| `REFRESH_TOKEN_SECRET` | Secret for signing refresh JWTs |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime (e.g. `10d`) |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CORS_ORIGIN` | Allowed origin for CORS (frontend URL) |

### Running the App

```bash
# Development — auto-restarts on file changes
npm run dev

# Production
npm start
```

The server will start on `http://localhost:8000` (or the port defined in `.env`).

---

## 📡 API Reference

All routes are prefixed with `/api/v1`. Protected routes require a valid JWT access token sent as a cookie or in the `Authorization: Bearer <token>` header.

### 🏥 Healthcheck
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/healthcheck` | ❌ | Server health status |

### 👤 Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users/register` | ❌ | Register with avatar & cover image |
| POST | `/users/login` | ❌ | Login and receive tokens |
| POST | `/users/logout` | ✅ | Logout and clear cookies |
| POST | `/users/refresh-token` | ❌ | Refresh access token |
| GET | `/users/current-user` | ✅ | Get authenticated user's profile |
| PATCH | `/users/update-account` | ✅ | Update name / email |
| PATCH | `/users/avatar` | ✅ | Update avatar image |
| PATCH | `/users/cover-image` | ✅ | Update cover image |
| PATCH | `/users/change-password` | ✅ | Change current password |
| GET | `/users/c/:username` | ✅ | Get channel profile by username |
| GET | `/users/history` | ✅ | Get current user's watch history |

### 📹 Videos
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/videos` | ✅ | Get all videos (paginated, filterable) |
| POST | `/videos` | ✅ | Upload a new video |
| GET | `/videos/:videoId` | ✅ | Get a single video by ID |
| PATCH | `/videos/:videoId` | ✅ | Update video details / thumbnail |
| DELETE | `/videos/:videoId` | ✅ | Delete a video |
| PATCH | `/videos/toggle/publish/:videoId` | ✅ | Toggle publish status |

### 💬 Comments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/comments/:videoId` | ✅ | Get all comments for a video |
| POST | `/comments/:videoId` | ✅ | Add a comment to a video |
| PATCH | `/comments/c/:commentId` | ✅ | Update a comment |
| DELETE | `/comments/c/:commentId` | ✅ | Delete a comment |

### ❤️ Likes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/likes/toggle/v/:videoId` | ✅ | Toggle like on a video |
| POST | `/likes/toggle/c/:commentId` | ✅ | Toggle like on a comment |
| POST | `/likes/toggle/t/:tweetId` | ✅ | Toggle like on a tweet |
| GET | `/likes/videos` | ✅ | Get all liked videos |

### 📂 Playlists
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/playlists` | ✅ | Create a playlist |
| GET | `/playlists/:playlistId` | ✅ | Get a playlist by ID |
| PATCH | `/playlists/:playlistId` | ✅ | Update playlist details |
| DELETE | `/playlists/:playlistId` | ✅ | Delete a playlist |
| PATCH | `/playlists/add/:videoId/:playlistId` | ✅ | Add video to playlist |
| PATCH | `/playlists/remove/:videoId/:playlistId` | ✅ | Remove video from playlist |
| GET | `/playlists/user/:userId` | ✅ | Get all playlists of a user |

### 🔔 Subscriptions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/subscriptions/c/:channelId` | ✅ | Toggle subscribe/unsubscribe |
| GET | `/subscriptions/c/:channelId` | ✅ | Get subscribers of a channel |
| GET | `/subscriptions/u/:subscriberId` | ✅ | Get channels a user is subscribed to |

### 🐦 Tweets
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/tweets` | ✅ | Create a tweet |
| GET | `/tweets/user/:userId` | ✅ | Get all tweets by a user |
| PATCH | `/tweets/:tweetId` | ✅ | Update a tweet |
| DELETE | `/tweets/:tweetId` | ✅ | Delete a tweet |

### 📊 Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard/stats` | ✅ | Get channel stats (views, subs, likes) |
| GET | `/dashboard/videos` | ✅ | Get all videos for the channel |

---

## 🗄 Data Models

### User
Stores credentials, profile media (avatar, cover image), and refresh token. Passwords are hashed with Bcrypt. Access and refresh tokens are generated via JWT.

### Video
References the owner (User). Stores Cloudinary URLs for video file and thumbnail, plus metadata like title, description, duration, view count, and publish status.

### Comment
Polymorphic — linked to a video and an owner (User). Supports full CRUD.

### Like
Polymorphic — a single model tracks likes across videos, comments, and tweets using optional reference fields.

### Playlist
Belongs to an owner (User) and holds an array of Video references.

### Subscription
A simple join model with two fields: `subscriber` (the follower) and `channel` (the followed User).

### Tweet
Short-form posts owned by a User with like support.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature-name`
3. Commit your changes — `git commit -m "feat: add your feature"`
4. Push to the branch — `git push origin feature/your-feature-name`
5. Open a Pull Request

Please ensure your code passes Prettier formatting before submitting:

```bash
npx prettier --write .
```

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/DIGVIJAY-TRIPATHY">Digvijay Tripathy</a>
</div>
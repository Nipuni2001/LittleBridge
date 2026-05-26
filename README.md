# LittleBridge 🤍
### Digitalizing the Adoption & Sponsorship Process in Sri Lanka

> A full-stack web platform connecting adoptive families, generous sponsors, and verified orphanages — with transparency, accountability, and real-time progress tracking at every step.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [User Roles](#user-roles)
- [API Overview](#api-overview)
- [Security](#security)
- [Database](#database)
- [Contact](#contact)

---

## Overview

LittleBridge is a role-based web application built to eliminate the pain points of traditional adoption and orphanage sponsorship in Sri Lanka — slow follow-up, unclear next steps, inconsistent communication, and paper-heavy processes.

The platform provides:
- A **guided 7-stage adoption journey** with document upload and real-time timeline tracking
- A **geo-located sponsorship system** that prioritises orphanages with the fewest recent donations
- An **orphanage portal** for managing donation needs and incoming sponsorship requests
- Separate **admin and childcare services dashboards** for approval and document verification
- A **built-in NLP chatbot** powered by a custom-trained Keras neural network

---

## Key Features

| Feature | Description |
|---|---|
| Role-based authentication | Adopter, Sponsor, Both, Orphanage, Admin, Childcare Services, Guest |
| 7-stage adoption timeline | Auto-initialised on application start; stage advances automatically when all mandatory docs are approved |
| Document upload & verification | Adopters upload PDFs/images; Childcare staff review and approve; both parties notified via email |
| Geolocation | Google Maps API used to find nearby orphanages; directions link on every card |
| Sponsorship & calendar booking | Monetary and goods donations with scheduled delivery dates; orphanage confirm/decline flow |
| Donation needs board | Orphanages list what they need; sponsors see live needs sorted by urgency |
| Email notifications | Resend API — welcome, application start, document upload/approval/rejection, stage completion, donation events |
| In-app notifications | Bell icon with unread count; mark-one and mark-all-read |
| NLP Chatbot | Custom-trained Keras model (NLTK + bag-of-words + 256-128-64 Dense network) served via Flask |
| Admin dashboard | User management, orphanage approval, document review, adoption application overview |
| Guest browsing | Sponsors can donate anonymously without creating an account |
| AES-256 encryption | Sensitive data encryption utility; bcrypt password hashing (cost 12); JWT auth |

---

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser Client                │
│         React 18 + Vite + Tailwind CSS          │
└───────────────────┬─────────────────────────────┘
                    │  HTTP / REST
        ┌───────────▼──────────┐
        │   Node.js / Express  │  :5000
        │   REST API Backend   │
        └──────┬──────┬────────┘
               │      │
    ┌──────────▼──┐  ┌▼──────────────┐
    │  MySQL DB   │  │ Resend Email  │
    │ littlebridge│  │     API       │
    └─────────────┘  └───────────────┘

        ┌─────────────────────┐
        │  Flask NLP Service  │  :5001
        │  Keras chatbot model│
        └─────────────────────┘
```

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool & dev server |
| Tailwind CSS | 3 | Utility-first styling |
| React Router DOM | 6 | Client-side routing |
| Axios | 1.x | HTTP client |
| Lucide React | 0.383 | Icon library |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express.js | 4 | REST API framework |
| mysql2 | 3 | MySQL driver (promise-based pool) |
| jsonwebtoken | 9 | JWT authentication |
| bcryptjs | 2 | Password hashing (cost 12) |
| multer | 1 | File upload (25 MB limit) |
| express-validator | 7 | Request validation |
| cors | 2 | Cross-origin policy |
| dotenv | 16 | Environment configuration |
| express-rate-limit | 7 | API rate limiting |
| resend | 3 | Transactional email API |

### NLP Chatbot Service
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.12 | Runtime |
| Flask | 3.0 | HTTP API server |
| Flask-CORS | 4.0 | Cross-origin for chatbot |
| NLTK | 3.8.1 | Tokenisation & lemmatisation |
| NumPy | 1.26 | Bag-of-words arrays |
| TensorFlow / Keras | 2.16 | Neural network (Dense 256-128-64) |
| python-dotenv | 1.0 | Environment config |

### Database
| Technology | Purpose |
|---|---|
| MySQL 8.4 | Primary relational database |
| phpMyAdmin | Database management (development) |

### External APIs & Services
| Service | Purpose |
|---|---|
| Google Maps API | Geolocation, nearby orphanage search, coordinate extraction from Maps URLs |
| Resend API | Transactional email delivery (welcome, doc approval, stage updates, donations) |

### Security
| Mechanism | Implementation |
|---|---|
| Password hashing | bcrypt, cost factor 12 |
| Authentication | JWT (7-day expiry for users, 24h for guests) |
| Data encryption | AES-256-CBC (utils/encryption.js) |
| Rate limiting | express-rate-limit (100 req/15 min general, 20 req/15 min auth) |
| File validation | Multer filter — PDF, JPG, JPEG, PNG only; 25 MB max |

---

## Prerequisites

Make sure the following are installed:

- **Node.js** v18 or higher — https://nodejs.org
- **npm** v9+
- **MySQL** 8.4 — https://dev.mysql.com/downloads/
- **Python** 3.12 — https://www.python.org
- **pip** (comes with Python)

---

## Project Structure

```
adoption-sponsorship-system/
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/         # ChatbotWidget, Landing, NotificationBell, ProfileDropdown, RoleGuard
│   │   ├── context/            # AuthContext (JWT state management)
│   │   ├── pages/
│   │   │   ├── admin/          # AdminDashboard, ChildcareDashboard
│   │   │   ├── adoption/       # AdoptionDiscover, AdoptionDetails
│   │   │   ├── orphanage/      # OrphanageDashboard, OrphanageRegister
│   │   │   └── sponsorship/    # SponsorshipPage
│   │   ├── services/           # api.js (Axios instance), authService.js
│   │   └── styles/             # theme.css
│   ├── .env
│   └── package.json
│
├── backend/                    # Node.js / Express API
│   ├── config/                 # database.js, security.js
│   ├── controllers/            # adoptionController, authController, orphanageController, sponsorshipController, notificationController
│   ├── middleware/             # auth.js (authenticateToken, authenticateAdmin, optionalAuth), errorHandler.js
│   ├── routes/                 # auth, adoptions, orphanages, sponsorships, notifications, contact, admin
│   ├── services/               # emailService.js (Resend)
│   ├── uploads/                # Uploaded documents (auto-created)
│   ├── utils/                  # encryption.js
│   ├── .env
│   └── server.js
│
└── chatbot-service/            # Python Flask NLP service
    ├── chatbot/
    │   ├── model.keras         # Trained Keras model
    │   ├── words.pkl           # Vocabulary
    │   ├── classes.pkl         # Intent labels
    │   └── predictor.py        # Inference class
    ├── intents.json            # 20 intent definitions
    ├── train_model.py          # Training script
    ├── app.py                  # Flask server
    └── requirements.txt
```

---

## Installation & Setup

### 1. Clone & install frontend

```bash
cd frontend
npm install
```

### 2. Install backend

```bash
cd backend
npm install
```

### 3. Set up the database

1. Create the database in MySQL:
   ```sql
   CREATE DATABASE littlebridge_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Import the schema:
   ```bash
   mysql -u root -p littlebridge_db < littlebridge_db.sql
   ```

### 4. Create the uploads folder

```bash
mkdir -p backend/uploads/documents
```

### 5. Set up the Python chatbot environment

```bash
cd chatbot-service
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 6. Train the chatbot model (first time only)

```bash
cd chatbot-service
python train_model.py
```

This generates `chatbot/model.keras`, `chatbot/words.pkl`, and `chatbot/classes.pkl`.

---

## Running the Application

Open **three separate terminals**:

### Terminal 1 — Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### Terminal 2 — Backend API
```bash
cd backend
node server.js
# Runs on http://localhost:5000
```

### Terminal 3 — Chatbot Service
```bash
cd chatbot-service
venv\Scripts\activate     # Windows
# or: source venv/bin/activate   (macOS/Linux)
python app.py
# Runs on http://localhost:5001
```

---

## Environment Variables

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_CHATBOT_URL=http://localhost:5001
```

### `backend/.env`

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=littlebridge_db

# JWT
JWT_SECRET=your_strong_secret_here
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Admin
ADMIN_REGISTRATION_CODE=LB_ADMIN_2026
ADMIN_EMAIL=your_admin_email@gmail.com

# Resend Email
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=onboarding@resend.dev

# Encryption
ENCRYPTION_KEY=your_64_char_hex_key

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Frontend CORS
FRONTEND_URL=http://localhost:5173
```

---

## User Roles

| Role | Access |
|---|---|
| **Adopter** | Discover orphanages, initiate adoption, upload documents, track 7-stage timeline |
| **Sponsor** | Browse orphanages, submit monetary/goods donations, book visits, view donation history |
| **Both** | Full access to both Adopter and Sponsor features |
| **Orphanage** | Register orphanage, manage donation needs, confirm/decline sponsorship requests |
| **Admin / Super Admin** | User management, orphanage approval, document review, platform statistics |
| **Childcare Services** | Orphanage approval, adoption document verification and approval |
| **Guest** | Browse sponsorship page, donate anonymously — no account required |

### Staff Login Credentials (Development)

| Username | Role | Password |
|---|---|---|
| `superadmin` | Super Administrator | `Admin@2026` |
| `admin` | Administrator | `Admin@2026` |
| `childcare` | Childcare Services | `Admin@2026` |

---

## API Overview

| Base Route | Description |
|---|---|
| `POST /api/auth/register` | Register new user |
| `POST /api/auth/login` | User login |
| `POST /api/auth/guest-login` | Create anonymous guest session |
| `POST /api/auth/admin/login` | Staff login (admin_users table) |
| `GET /api/orphanages/nearby` | Geo-sorted orphanage list |
| `GET /api/orphanages/search` | Search by name / city |
| `POST /api/orphanages/register` | Submit orphanage registration |
| `PUT /api/orphanages/:id/approve` | Approve orphanage (Childcare/Admin) |
| `POST /api/adoptions/initiate` | Start adoption application |
| `GET /api/adoptions/:id/timeline` | Get 7-stage timeline |
| `POST /api/adoptions/upload-document` | Upload adoption document |
| `PUT /api/orphanages/documents/:id/review` | Approve/reject document (Childcare) |
| `POST /api/sponsorships` | Submit donation request |
| `PUT /api/sponsorships/:id/confirm` | Orphanage confirms donation |
| `GET /api/notifications` | Fetch user notifications |
| `GET /api/admin/users` | List all platform users (Admin) |
| `POST /api/contact` | Submit landing page contact form |

---

## Security

- All passwords hashed with **bcrypt** (cost factor 12) — plain text is never stored
- **JWT tokens** signed with `JWT_SECRET`; user tokens expire in 7 days, guest tokens in 24 hours
- **AES-256-CBC** encryption available for sensitive data fields via `utils/encryption.js`
- **Role-based access control** enforced at middleware level — every protected route checks `req.user.userType`
- **File validation** — Multer rejects any upload that is not PDF, JPG, JPEG, or PNG; max 25 MB
- **Rate limiting** — 100 requests per 15 minutes general; 20 per 15 minutes on auth endpoints (disabled in development)
- **CORS** configured to allow only the frontend origin (`FRONTEND_URL`)
- **Input validation** — `express-validator` on all auth and registration endpoints

---

## Database

The database contains 12 tables:

| Table | Purpose |
|---|---|
| `users` | All registered user accounts |
| `admin_users` | Staff accounts (admin, childcare, super_admin) |
| `orphanages` | Orphanage registrations and approval status |
| `adoption_applications` | Adoption application records |
| `adoption_timeline` | 7-stage timeline per application |
| `adoption_documents` | Document checklist by country |
| `user_documents` | Uploaded documents with verification status |
| `sponsorships` | Donation/sponsorship records |
| `donation_needs` | Active needs listed by orphanages |
| `orphanage_sponsorship_stats` | 30/90-day sponsorship counters |
| `notifications` | In-app notification records |
| `contact_submissions` | Landing page contact form submissions |
| `activity_logs` | Audit log of all user actions |
| `appointments` | Booking/visit scheduling records |

---

## Contact

**LittleBridge**
📧 lttlbrdg@gmail.com
📞 +94 11 265 6163
📍 No. 5, Park Street, Colombo 5, Sri Lanka

**Founder & CEO:** Nipuni Niwarthana

---

*© 2026 LittleBridge. Built with ❤️ for every child's future.*

<div align="center">

# CampusIQ
**Your Gateway to Higher Education**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Neon](https://img.shields.io/badge/Neon-Serverless-00E599?style=flat&logo=neon)](https://neon.tech/)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-v5-purple?style=flat&logo=nextauth)](https://next-auth.js.org/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat&logo=vercel)](https://vercel.com/)

</div>

## 🌐 Live Demo
**[Experience CampusIQ Live](https://campus-iq-puce.vercel.app)**

## Overview
CampusIQ is a comprehensive, open-source platform designed to help students discover, compare, and analyze higher education institutions across India. Built with a modern Next.js App Router stack, it provides highly detailed college data, powerful prediction tools, and an engaging community discussion system to guide academic decisions.

## 🌟 Core Features
* **Detailed College Directory:** Browse 67+ top institutions (IITs, NITs, and top private colleges) complete with location data, institution types, and detailed analytics.
* **Rank Predictor:** Estimate admissions chances using a sophisticated algorithm supporting JEE Main, JEE Advanced, and BITSAT scores, fully adjusted for category and reservation logic.
* **Intelligent Comparison Tool:** Compare multiple colleges side-by-side with automatic best-metric highlighting (highest placement, lowest fees) and save comparison profiles to your account.
* **Community Q&A:** Engage in threaded discussions, post questions, provide answers, mark accepted solutions, and manage your own content.
* **Modern UI/UX:** Enjoy a sleek, responsive interface featuring glassmorphism elements, dynamic gradients, robust dark mode, and seamless skeleton loading states.

## 🏗️ Architecture

```text
    ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
    │                 │       │                 │       │                 │
    │   Next.js 14    │       │   API Routes    │       │   Prisma ORM    │
    │  (App Router)   ├──────►│  (Serverless)   ├──────►│  (Connection    │
    │                 │       │                 │       │    Pooler)      │
    └─────────────────┘       └─────────────────┘       └────────┬────────┘
                                                                 │
                                                                 ▼
                                                        ┌─────────────────┐
                                                        │                 │
                                                        │  Neon Postgres  │
                                                        │  (Serverless    │
                                                        │    Database)    │
                                                        └─────────────────┘
```

## 💻 Tech Stack

### Frontend
| Technology | Description |
|------------|-------------|
| **Next.js 14** | React framework leveraging App Router for SSR and static generation. |
| **React** | Component-based UI library. |
| **Tailwind CSS** | Utility-first CSS framework for styling and glassmorphism. |
| **TypeScript** | Strongly typed JavaScript for type safety and superior DX. |

### Backend
| Technology | Description |
|------------|-------------|
| **Prisma** | Next-generation Node.js and TypeScript ORM. |
| **PostgreSQL** | Primary relational database hosted on Neon. |
| **Neon** | Serverless Postgres database with edge connection pooling. |
| **NextAuth v5** | Complete authentication solution (Email/Password + Google OAuth). |
| **bcryptjs** | Secure password hashing. |

### DevOps & Deployment
| Technology | Description |
|------------|-------------|
| **Vercel** | Edge network deployment for Next.js applications. |
| **Git/GitHub** | Version control and repository hosting. |

## 🚀 Implemented Product Features

* **Advanced Filtering & Pagination:** Browse colleges dynamically with intuitive search, smart filtering, and fast pagination.
* **Comprehensive College Profiles:** Dive deep into specific colleges through tabbed views (Overview, Placements, Courses, Reviews, Discussions).
* **Robust Rank Predictor:** Data-driven predictions estimating college entry based on normalized exam scores.
* **Dynamic Comparison Engine:** Real-time side-by-side evaluation of critical metrics (fees, average package, highest package, placement rate) with automatic visual highlighting for optimal choices.
* **Community Features:** Complete Q&A system allowing question posting, answer threading, and question deletion by owners.
* **User Accounts:** Secure registration/login using bcrypt, Google OAuth integration, and JWT-based session management.
* **Save functionality:** Bookmark your favorite colleges and customized comparison templates directly to your user profile.
* **Performance Enhancements:** Fluid UI transitions utilizing React Suspense, skeleton loaders, and Next.js Image optimizations.
* **Resilience:** Comprehensive Error Boundaries implemented across the App Router to prevent catastrophic UI failures.

## 📂 Project Structure

```text
campusiq/
├── app/
│   ├── (auth)/             # Login and registration flows
│   ├── api/                # Serverless API routes
│   │   ├── colleges/       # College data endpoints
│   │   ├── predictor/      # Rank prediction logic
│   │   ├── questions/      # Community discussion endpoints
│   │   └── user/           # Saved colleges and comparisons
│   ├── colleges/           # College browsing and detail pages
│   ├── compare/            # Side-by-side comparison engine
│   ├── discussions/        # Global Q&A board
│   ├── predictor/          # Rank predictor interface
│   ├── saved/              # User profile / saved items
│   └── layout.tsx          # Root layout with providers and metadata
├── components/
│   ├── colleges/           # College-specific UI components
│   └── ui/                 # Reusable UI elements (Navbar, Cards, Buttons)
├── lib/
│   └── prisma.ts           # Prisma client instantiation
├── prisma/
│   ├── data/               # Seed data (67 top colleges)
│   ├── schema.prisma       # Database schema and models
│   └── import.ts           # Database seeding script
├── auth.ts                 # NextAuth v5 configuration
├── middleware.ts           # Authentication and routing middleware
└── tailwind.config.ts      # Tailwind CSS theme and styling rules
```

## 🛠️ Getting Started

### Prerequisites
* Node.js (v18 or higher)
* PostgreSQL Database (Neon recommended)
* Google Cloud Console account (for OAuth)

### 1. Clone the repository
```bash
git clone https://github.com/VijayPant375/CampusIQ.git
cd campusiq
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and configure the following variables:
```env
DATABASE_URL="postgresql://user:password@host/db_name?sslmode=require"
NEXTAUTH_SECRET="your_secure_random_string_here"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 4. Initialize Database
Push the Prisma schema to your PostgreSQL database and generate the Prisma client:
```bash
npx prisma db push
npx prisma generate
```

### 5. Seed the Database
Populate the database with the pre-configured 67 colleges:
```bash
npm run import:data
```

### 6. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to see the application running.

## ⚠️ Limitations and Notes
* **Build Optimization:** ESLint is intentionally disabled during the production build step (`eslint.ignoreDuringBuilds: true` in `next.config.mjs`) to ensure smooth CI/CD deployments on Vercel without being blocked by strict developmental warnings.
* **Data scope:** The initial database is seeded with 67 top Indian engineering institutes. More can be added via the database natively.
* **Authentication:** Ensure Google OAuth redirect URIs are properly configured in your Google Cloud Console for both `http://localhost:3000/api/auth/callback/google` (development) and your live Vercel domain (production).

---

<div align="center">
  Built with ❤️ by VijayPant375
  <br />
  If you find this project helpful, please consider giving it a ⭐!
</div>

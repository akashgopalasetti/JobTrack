# 🚀 JobTrack – Full-Stack Job Application Tracker

JobTrack is a complete, beginner-friendly, and modern full-stack web application built to help job seekers organize, track, and manage their job applications across every stage of the hiring pipeline.

Built with **React.js + Vite** on the frontend, **Node.js + Express.js** on the backend, and **MongoDB Atlas** for persistent cloud database storage.

---

## 📑 Table of Contents

1. [Features](#-features)
2. [Technology Stack](#-technology-stack)
3. [Project Structure](#-project-structure)
4. [MongoDB Atlas Step-by-Step Setup Guide](#-mongodb-atlas-step-by-step-setup-guide)
5. [Local Installation and Running](#-local-installation-and-running)
6. [Environment Variables](#-environment-variables)
7. [REST API Documentation](#-rest-api-documentation)
8. [Deployment Guide](#-deployment-guide)
9. [Troubleshooting Guide](#-troubleshooting-guide)

---

## ✨ Features

- **No Authentication / Zero Friction**: Opens directly to the **Add Job** page. No login, sign-up, or registration barriers.
- **Two Focused Pages**:
  1. `/` — **Add Job**: Professional form with real-time field validation, edit mode with prefilled values, reset, and cancel actions.
  2. `/applications` — **My Applications**: Comprehensive dashboard with search, status filtering, applied date sorting, metrics, responsive table (desktop), cards (mobile), and confirmation modals.
- **Complete CRUD Operations**: Create, Read, Update, and Delete applications permanently stored in MongoDB Atlas.
- **Modern Responsive UI**: Clean navy-blue styling (`#1e3a5f`), accessible form controls, color-coded status badges, toast notifications, and mobile-friendly layouts.
- **Safe External Links**: Job posting and resume links open securely in a new tab with `target="_blank" rel="noopener noreferrer"`.

---

## 🛠 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, React Router DOM 6, Axios |
| **Backend** | Node.js (ESM), Express.js 4, Mongoose 8, CORS, Dotenv |
| **Database** | MongoDB Atlas (Cloud NoSQL Database) |
| **Styling** | Pure Modern CSS, Custom CSS Variables, Plus Jakarta Sans typography |

---

## 📁 Project Structure

```text
JobTrack/
├── .gitignore                          # Git ignore rules for node_modules, .env, and dist
├── README.md                           # Comprehensive documentation and setup instructions
├── backend/
│   ├── .env.example                    # Example backend environment variables
│   ├── .env                            # Local backend environment variables (gitignored)
│   ├── package.json                    # Backend dependencies and scripts
│   ├── index.js                        # Express server entry point and middleware
│   ├── config/
│   │   └── db.js                       # MongoDB Atlas connection handler
│   ├── models/
│   │   └── Application.js              # Mongoose schema and validation rules
│   ├── controllers/
│   │   └── applicationController.js    # CRUD business logic and request handlers
│   ├── routes/
│   │   └── applicationRoutes.js        # Express REST API routes
│   └── middleware/
│       └── errorHandler.js             # Centralized error handler and 404 middleware
└── frontend/
    ├── .env.example                    # Example frontend environment variables
    ├── .env                            # Local frontend environment variables (gitignored)
    ├── package.json                    # Frontend dependencies and Vite scripts
    ├── vite.config.js                  # Vite configuration
    ├── index.html                      # HTML5 template and font imports
    ├── vercel.json                     # SPA client-side rewrite rules for Vercel
    └── src/
        ├── main.jsx                    # React entry point with BrowserRouter
        ├── App.jsx                     # Route definitions and toast notification provider
        ├── services/
        │   └── applicationService.js   # Axios API client configured with VITE_API_URL
        ├── components/
        │   ├── Navbar.jsx              # Responsive header navigation
        │   ├── ApplicationForm.jsx     # Reusable Create & Edit form with validation
        │   ├── ApplicationTable.jsx    # Desktop data table view
        │   ├── ApplicationCard.jsx     # Mobile card view
        │   ├── StatusBadge.jsx         # Color-coded status indicator
        │   ├── SearchFilter.jsx        # Search bar, status filter, and date sort toolbar
        │   ├── Loading.jsx             # Spinner loading indicator
        │   ├── ConfirmDialog.jsx       # Modal dialog for delete confirmation
        │   └── Toast.jsx               # Feedback notification alerts
        ├── pages/
        │   ├── AddJob.jsx              # Page component for / (Add/Edit job)
        │   └── MyApplications.jsx      # Page component for /applications (Dashboard)
        └── styles/
            ├── global.css              # Theme tokens, CSS variables, utility styles
            ├── navbar.css              # Navigation styling
            ├── form.css                # Form layout, inputs, and validation messages
            └── dashboard.css           # Table, cards, stats, and modal styling
```

---

## 🍃 MongoDB Atlas Step-by-Step Setup Guide

Follow these beginner-friendly steps to connect JobTrack to a free MongoDB Atlas cloud database:

### 1. Create a Free MongoDB Atlas Account
1. Visit [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and register for a free account.
2. Sign in to your MongoDB Atlas dashboard.

### 2. Create a Free Database Cluster
1. Click **Build a Database**.
2. Select the **M0 Free (Shared)** tier (100% free forever, no credit card required).
3. Choose your preferred cloud provider (AWS, Google Cloud, or Azure) and the region closest to you.
4. Leave Cluster Name as `Cluster0` or name it `JobTrackCluster`.
5. Click **Create Deployment**.

### 3. Create a Database User
1. In the **Security Quickstart** modal (or navigate to **Security** → **Database Access** on the left menu):
2. Choose **Password** authentication.
3. Enter a **Username** (e.g. `jobtrack_user`).
4. Enter a **Password** (or click *Autogenerate Secure Password*). **Make sure to save this password!**
5. Ensure the user has the **Read and write to any database** privilege.
6. Click **Create User**.

> [!NOTE]
> Database user credentials belong strictly to MongoDB Atlas for backend database communication. They are **not** login credentials for users of the web application. JobTrack has no user login screen.

### 4. Configure Network Access (IP Whitelist)
1. In the Atlas dashboard, navigate to **Security** → **Network Access** in the left sidebar.
2. Click the **+ Add IP Address** button.
3. Choose **Allow Access from Anywhere** (`0.0.0.0/0`).
   - *Why?* This ensures your local development computer and cloud hosting platforms (like Render or Vercel) can communicate with your database without being blocked.
4. Click **Confirm**. It will take about 30 seconds for the status to show **Active**.

### 5. Copy your MongoDB Connection String
1. Go to **Database** on the left navigation panel.
2. Click the **Connect** button next to your cluster.
3. Choose **Drivers** (Node.js).
4. Copy the connection string provided. It will look like this:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. Specify the database name by inserting `jobtrack` right before the `?`:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/jobtrack?retryWrites=true&w=majority&appName=Cluster0
   ```

### 6. Add Connection String to `backend/.env`
1. Open `backend/.env` in your code editor.
2. Replace `your_mongodb_atlas_connection_string` with your actual connection string.
3. Replace `<username>` with your database username and `<password>` with your database password:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://jobtrack_user:MySecurePass123@cluster0.abcde.mongodb.net/jobtrack?retryWrites=true&w=majority
   FRONTEND_URL=http://localhost:5173
   ```

> [!TIP]
> If your password includes special characters like `@`, `:`, `/`, or `#`, URL-encode them (e.g., `@` becomes `%40`, `#` becomes `%23`).

---

## 💻 Local Installation and Running

### Prerequisites
- [Node.js](https://nodejs.org/) version 18.0.0 or higher.
- `npm` (comes bundled with Node.js).

### Step 1: Clone or Navigate to the Project
```bash
cd JobTrack
```

### Step 2: Start the Backend Server
Open your first terminal window:
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the server in development mode with nodemon
npm run dev
```

You should see:
```text
🔄 Initializing JobTrack Backend Server...
✅ MongoDB Connected successfully to host: cluster0-shard-00-00.abcde.mongodb.net
🚀 JobTrack server is running on http://localhost:5000
📡 Health Check: http://localhost:5000/api/health
📋 Applications API: http://localhost:5000/api/applications
```

### Step 3: Start the Frontend Application
Open a second terminal window:
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Vite will start the client on:
```text
  VITE v6.0.7  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The application opens directly to the **Add Job** page!

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Port number for Express server | `5000` |
| `MONGODB_URI` | MongoDB Atlas SRV connection string | `mongodb+srv://<user>:<pwd>@cluster...` |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)
| Variable | Description | Default / Example |
|---|---|---|
| `VITE_API_URL` | Base URL for backend REST API endpoints | `http://localhost:5000/api` |

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api`

### 1. Server Health Check
- **Endpoint:** `GET /api/health`
- **Description:** Verifies server uptime and MongoDB connection state.
- **Response (200 OK):**
```json
{
  "success": true,
  "status": "ok",
  "message": "JobTrack API server is healthy and running",
  "database": {
    "connected": true,
    "status": "Connected to MongoDB Atlas"
  },
  "uptime": "42s",
  "timestamp": "2026-10-21T11:00:00.000Z"
}
```

---

### 2. Get All Applications
- **Endpoint:** `GET /api/applications`
- **Query Parameters (Optional):**
  - `status`: Filter by status (`Applied`, `Interview`, `Assessment`, `Offer`, `Rejected`, `Saved`)
  - `search`: Search text matching `companyName` or `jobTitle`
  - `sort`: `desc` (newest first, default) or `asc` (oldest first)
- **Response (200 OK):**
```json
{
  "success": true,
  "status": 200,
  "count": 1,
  "data": [
    {
      "_id": "671629fae158d928bc345678",
      "companyName": "Google",
      "jobTitle": "Software Engineer II",
      "status": "Interview",
      "location": "Mountain View, CA / Hybrid",
      "appliedDate": "2026-10-15T00:00:00.000Z",
      "jobPostingUrl": "https://careers.google.com/jobs/results/12345",
      "resumeName": "SWE-Resume-Google.pdf",
      "resumeLink": "https://drive.google.com/file/d/abcdef/view",
      "appliedEmail": "recruiter@google.com",
      "recruiterName": "Sarah Jenkins",
      "followUpDate": "2026-10-28T00:00:00.000Z",
      "notes": "Completed Technical Screen; Round 2 System Design scheduled.",
      "createdAt": "2026-10-21T10:45:00.000Z",
      "updatedAt": "2026-10-21T10:50:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Application by ID
- **Endpoint:** `GET /api/applications/:id`
- **Response (200 OK):**
```json
{
  "success": true,
  "status": 200,
  "data": {
    "_id": "671629fae158d928bc345678",
    "companyName": "Google",
    "jobTitle": "Software Engineer II",
    "status": "Interview"
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: When `:id` is not a valid 24-character hexadecimal MongoDB ObjectId.
  - `404 Not Found`: When `:id` is valid format but does not exist in the database.

---

### 4. Create New Application
- **Endpoint:** `POST /api/applications`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "companyName": "Stripe",
  "jobTitle": "Frontend Engineer",
  "status": "Applied",
  "location": "Remote",
  "appliedDate": "2026-10-20",
  "jobPostingUrl": "https://stripe.com/jobs/frontend-engineer",
  "resumeName": "Frontend-CV.pdf",
  "resumeLink": "https://drive.google.com/file/d/cv/view",
  "appliedEmail": "jobs@stripe.com",
  "recruiterName": "Alex Chen",
  "followUpDate": "2026-10-30",
  "notes": "Applied via referral link from Alex."
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "status": 201,
  "message": "Job application created successfully.",
  "data": {
    "_id": "67162b9ce158d928bc349999",
    "companyName": "Stripe",
    "jobTitle": "Frontend Engineer",
    "status": "Applied",
    "createdAt": "2026-10-21T10:55:00.000Z",
    "updatedAt": "2026-10-21T10:55:00.000Z"
  }
}
```
- **Validation Errors (400 Bad Request):**
  - Missing `companyName` or `jobTitle`
  - Invalid `status` enum
  - Malformed URL in `jobPostingUrl` or `resumeLink`
  - Malformed email in `appliedEmail`

---

### 5. Update Application
- **Endpoint:** `PUT /api/applications/:id`
- **Headers:** `Content-Type: application/json`
- **Request Body:** (Include only fields you want to update)
```json
{
  "status": "Offer",
  "notes": "Received formal offer letter! Base + Equity package."
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "status": 200,
  "message": "Job application updated successfully.",
  "data": {
    "_id": "67162b9ce158d928bc349999",
    "companyName": "Stripe",
    "jobTitle": "Frontend Engineer",
    "status": "Offer",
    "notes": "Received formal offer letter! Base + Equity package.",
    "updatedAt": "2026-10-21T11:05:00.000Z"
  }
}
```

---

### 6. Delete Application
- **Endpoint:** `DELETE /api/applications/:id`
- **Response (200 OK):**
```json
{
  "success": true,
  "status": 200,
  "message": "Job application deleted successfully.",
  "data": {
    "id": "67162b9ce158d928bc349999"
  }
}
```

---

## 🚢 Deployment Guide

### Deploy Backend to Render (Free Tier)
1. Push your project code to GitHub.
2. Sign in to [Render.com](https://render.com) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set the following configuration:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. In the **Environment Variables** section, add:
   - `PORT`: `5000` (Render also sets its own PORT automatically)
   - `MONGODB_URI`: *Your MongoDB Atlas connection string*
   - `FRONTEND_URL`: *Your deployed Vercel URL (e.g. `https://jobtrack-client.vercel.app`)*
   - `NODE_ENV`: `production`
6. Click **Create Web Service**. Note the deployed backend URL (e.g. `https://jobtrack-api.onrender.com`).

---

### Deploy Frontend to Vercel
1. Sign in to [Vercel.com](https://vercel.com) and click **Add New...** → **Project**.
2. Select your GitHub repository.
3. In the configuration settings:
   - **Root Directory:** Edit to select `frontend`.
   - **Framework Preset:** `Vite` (automatically detected).
4. In the **Environment Variables** section, add:
   - `VITE_API_URL`: `https://jobtrack-api.onrender.com/api` *(use your live Render backend URL)*
5. Click **Deploy**.
6. The `frontend/vercel.json` included in this repo ensures single-page routing works smoothly when refreshing `/applications`.

---

## 🔍 Troubleshooting Guide

### 1. MongoDB Atlas Connection Failure (`MongooseServerSelectionError`)
- **Symptoms:** Server says `MongoDB connection error: connect ECONNREFUSED` or `Server selection timed out`.
- **Solution:**
  1. Go to your MongoDB Atlas Dashboard → **Network Access**.
  2. Confirm an entry exists for `0.0.0.0/0` (Allow Access from Anywhere) and status is **Active**.
  3. Verify the password inside `backend/.env`. If your password has special characters like `@` or `#`, encode them (e.g., `P@ssword!` becomes `P%40ssword!`).
  4. Confirm your database user has read/write privileges in **Database Access**.

### 2. CORS Errors in Browser Console (`Cross-Origin Request Blocked`)
- **Symptoms:** `Access to XMLHttpRequest at 'http://localhost:5000/api/applications' from origin 'http://localhost:5173' has been blocked by CORS policy`.
- **Solution:**
  1. Confirm `FRONTEND_URL` in `backend/.env` matches your exact frontend URL (e.g. `http://localhost:5173` without trailing slashes).
  2. In production, ensure `FRONTEND_URL` on Render is set to your deployed Vercel domain.

### 3. HTTP 400 Bad Request
- **Symptoms:** Creating or editing a job returns 400 Bad Request.
- **Solution:**
  - Check that both `companyName` and `jobTitle` are not empty strings.
  - Check that URLs start with `http://` or `https://` (e.g. `https://linkedin.com`).
  - Check that email has standard format (`user@domain.com`).
  - When accessing `/api/applications/:id`, verify `:id` is a 24-character hexadecimal MongoDB ObjectId.

### 4. HTTP 404 on Browser Refresh on Vercel
- **Symptoms:** Loading `/applications` directly or hitting F5 results in a 404 page on Vercel.
- **Solution:**
  - This is caused by client-side routing. The repository includes `frontend/vercel.json` with a rewrite rule (`"source": "/(.*)", "destination": "/index.html"`) which instructs the host to serve `index.html` for all paths.

### 5. ES Module Errors (`Cannot use import statement outside a module`)
- **Symptoms:** Node throws syntax error on `import express from 'express'`.
- **Solution:**
  - Ensure `"type": "module"` is present in `backend/package.json`.
  - Always use file extensions in internal imports (e.g. `import db from './config/db.js'`).
"# JobTrack" 

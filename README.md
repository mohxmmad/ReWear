# ReWear


**ReWear** is a web-based platform that empowers users to exchange unused clothing through direct swaps or a point-based redemption system. The project promotes **sustainable fashion** and helps reduce **textile waste** by encouraging people to **reuse wearable garments** instead of discarding them.

## 📽️ Project Demo

[![Watch the demo](https://img.youtube.com/vi/naYZAi-OoO0/hqdefault.jpg)](https://www.youtube.com/watch?v=naYZAi-OoO0)


## 🌟 Unique Selling Proposition (USP)

- ♻️ **Eco-Friendly Fashion**: Encourages a circular economy by letting users give clothes a second life.
- 🔁 **Two Swap Options**:
  - **Direct Swaps** between users.
  - **Point-Based Redemptions**, where users earn points and use them to get other items.
- 🔐 **Moderated Listings**: Admin approval ensures only quality, appropriate items are listed.
- 📦 **User Dashboard**: Tracks swaps, redemptions, uploaded items, and current point balance.

## 📖 Project Description

ReWear allows users to:

- **Register/Login** via a session-based secure system.
- **List clothing items** with categories like size, condition, type, and tags.
- **Browse available clothes**, see detailed descriptions, and request swaps or redeem with points.
- **Track uploaded items**, view ongoing/completed swaps, and manage profiles.
- **Admins** can approve, reject, or remove item listings from a lightweight admin panel.

> The platform is designed with a strong emphasis on **minimal waste, maximum reuse**, and a **simple user experience** — suitable for both mobile and desktop devices.

---

## Tech Stack
- React + Vite (Frontend)
- Django Python (Backend)
- PostgreSQL (Database)
- Docker Compose for cross-platform compatibility
---

## 📲 Progressive Web App (PWA) Support

ReWear includes **Progressive Web App capabilities**, allowing users to:

- 🔌 Access key pages **even when offline**.
- 📱 Install the app on mobile or desktop for a **native-like experience**.
- 🗂️ Cache static assets and preloaded data for fast loading and smooth UX.

> This is especially useful in low-connectivity areas where users still want to browse listed items or manage their profile.

---

## 🌐 Frontend URL Structure

The frontend is powered by **Vite + React** and uses **React Router** for client-side navigation. Below are the key accessible routes:

| Route              | Description                            |
|-------------------|----------------------------------------|
| `/`        | Landing page introducing the platform  |
| `/landing`         | View all approved, available items     |

Local development runs on:  
**`http://localhost:5173`**

---

> PWA functionality kicks in after the first successful load. You can test this by visiting the site, then disconnecting internet and refreshing – the landing and browse pages should still be accessible.



## 📦 Prerequisites

Make sure the following tools are installed:

### Linux (Ubuntu)
- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Bash shell (already available)

### Windows (WSL Required)
- [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - Enable WSL Integration in Docker Desktop Settings

> **WSL is required on Windows** for Docker to run Linux containers smoothly.

---

## Set Up

### 1. Clone the Repository

```bash
git clone https://github.com/Mohammad-416/ReWear.git
cd ReWear
```

### 2. Create .env File for Backend

You must create a .env file inside the /backend folder before running the project.

**We are exposing these keys so it's easier for the judges to test our project**
**we'll change the API Keys once we are moving to production**


```env
# Backend secret for superuser API
SUPERUSER_SECRET_KEY=odoo@bitlords

# PostgreSQL connection
POSTGRES_DB=odoo
POSTGRES_USER=bitlords
POSTGRES_PASSWORD=odoo@bitlords
DB_HOST=db

# Django settings
SECRET_KEY=django-insecure-_3a*^#8cfjti#67h!@k!iv7hzs4g_1jt5=js^%p-xhxwc(%pph
DEBUG=True
ALLOWED_HOSTS=*


CLOUDINARY_CLOUD_NAME=dazkajqau
CLOUDINARY_API_KEY=265987191437164
CLOUDINARY_API_SECRET=eeoHj_ASXTxnSO--9c6AY4xMoyA



```

### 3. Make the start script executable
```bash
chmod +x start.sh
```

### 4. Run the project
```bash
./start.sh
```

🐳 This script will:

    Build Docker containers

    Start Postgres DB

    Run Django migrations

    Start Django and Vite development servers

## Create Django Superuser via API (Secure Endpoint)

This project provides an API route to create a Django superuser (admin account) via a `POST` request. It is protected with a secret key defined in the `.env` file.

---

### Endpoint
POST /api/accounts/create-superuser/
```bash

---

## Request Body (JSON)

{
  "username": "adminuser",
  "email": "admin@example.com",
  "password": "adminpassword123",
  "secret_key": <SUPERUSER_SECRET_KEY_FROM_ENV>
}

```

### Login on Django Admin Panel

Once the superuser is created, visit:

http://localhost:8000/admin/

Use the created credentials to log in.


## Project Structure
```bash
.
├── backend/           # Django backend
│   ├── manage.py
│   ├── init_backend.py
│   ├── venv
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env               # Environment variables
│   ├── core/
│   └── ...
├── frontend/          # React + Vite frontend
│   └── ...
├── start.sh           # One-command startup script
├── docker-compose.yml
├── .gitignore
└── README.md
```

 ### 📊 Metadata-Based Classification Model
 
A machine learning classification model trained using metadata features.  

📎 [View Google Colab Notebook](https://colab.research.google.com/drive/1_BXgfq69Pnfg9DKTwnTYRFl2gTEqBxVB?usp=sharing)


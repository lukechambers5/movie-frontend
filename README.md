# 🎬 CineScope Frontend

The frontend of **CineScope**, a movie watchlist and recommendation platform. Built using **React.js**, styled with **Tailwind CSS**, and hosted on **GitHub Pages** for fast, public access.

## Tech Stack

- **React.js** – Component-based UI
- **Tailwind CSS** – Utility-first CSS framework
- **Axios** – API communication
- **React Router** – Client-side routing
- **GitHub Pages** – Static site hosting

## 🌐 Live Site

**URL:** [https://lukechambers5.github.io/movie-frontend](https://lukechambers5.github.io/movie-frontend)

---

## Authentication

- Users sign in with email/password using the backend `/auth` endpoints.
- **JWT tokens** are stored in `Secure`, `HttpOnly` cookies set by the backend.
- On page load, the frontend sends a request to `/auth/check` to validate login status.
- Auth state is maintained across routes, but not across refreshes unless the cookie is still valid.

---

## Deployment

This app is deployed using **GitHub Pages** via the `gh-pages` branch.

### Run Locally

```bash
npm install
npm run dev
```

### Build and Deploy
```bash
npm run build
npm run deploy
```
---

## Backend Integration

The frontend connects to a **Java Spring Boot** backend hosted on **AWS EC2** over HTTPS.

### Base API URL

`https://3.141.14.26.sslip.io`


### Example Routes

- `POST /auth/login` – User login  
- `GET /watchlist` – Fetch user's movie watchlist  

### Request Configuration

- Uses **Axios** for all API calls  
- Sends cookies with `withCredentials: true`  
- Expects **JWT** to be stored securely in `HttpOnly`, `Secure` cookies

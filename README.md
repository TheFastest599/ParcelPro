# ParcelPro

ParcelPro is a courier service application that helps users manage and track their packages efficiently.

## Technologies Used

- MERN Stack (MongoDB, Express, React, Node.js)
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js
- npm

### Repository Structure

- `backend/` - Express.js backend (API, database models, authentication, etc.)
- `frontend/` - React frontend (UI, client logic)

## Monorepo Setup

### Install All Dependencies

From the root folder, run:

```sh
npm install
```

This will install dependencies for both backend and frontend automatically.

### Build Frontend (Production)

To build the frontend for production and output to the root `/build` folder:

```sh
npm run build:prod
```

For development build (output in `frontend/build`):

```sh
npm run build:dev
```

### Start Backend Server

From the root folder, run:

```sh
npm start
```

This will start the backend server. In production, it will serve the frontend from the root `/build` folder.

### Environment Variables

Place your environment files in the root as `.env.backend` (for backend) and `.env.frontend` (for frontend). The backend will automatically load `.env.backend` if present.

---

The frontend will run on [http://localhost:3000](http://localhost:3000) by default in development mode.

## Scripts

- `npm install` — Installs all dependencies (backend & frontend)
- `npm run build:prod` — Builds frontend to root `/build` (for production)
- `npm run build:dev` — Builds frontend to `/frontend/build` (for development)
- `npm start` — Starts backend server (serves frontend from `/build` in production)

## Links

- [Live Demo](https://parcelpro.onrender.com/)

---

For more details, see the `README.md` files in each subfolder.

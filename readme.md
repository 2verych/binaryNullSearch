# Discount Cards Sharing App

This repository provides a minimal full stack application for sharing discount cards.
It contains a React frontend and a Node.js backend organized with npm workspaces.

## Structure

- `frontend/` – React application built with Vite.
- `backend/` – Express API server.

## Getting Started

Install dependencies from the repository root:

```bash
npm install
```

To run the backend API:

```bash
npm --workspace backend start
```

In another terminal, start the frontend dev server:

```bash
npm --workspace frontend start
```

The React app will be available at <http://localhost:5173> and proxies API requests to the backend running on port 3001.

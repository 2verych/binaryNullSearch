# Binary Null Search App

This is a minimal Express application providing Google OAuth login and the ability for users to store photos of their cards. The email obtained from OAuth is used as the unique identifier for each user.

## Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your Google OAuth credentials and session secret.
3. Start the server
   ```bash
   node server.js
   ```

The server will run on port `3000` by default.

## Features

- Login with Google OAuth (other providers can be added using Passport strategies).
- Session management with user email as UID.
- Authenticated users can upload photos of cards via `/upload` and list them via `/cards`.

## Adding Other Providers

Additional providers can be configured by installing the corresponding Passport strategy and adding it to `server.js` similar to the Google example.

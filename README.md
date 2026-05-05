# LoveLetterSaaS (LovePage)

LoveLetterSaaS is a template-driven web app for creating personalized romantic pages that can be shared via unique link and QR code.

Users can:
- choose a template
- customize text, style, music, and images
- preview before publish
- publish after payment
- share the final page with recipients

## What We Are Building

This project is an emotional gifting SaaS focused on:
- fast creation flow (minutes, not hours)
- mobile-friendly interactive templates
- one-time payment to publish
- long-lived share links for recipients

## Live App

- Hosting URL: `https://loveletters-7612c.web.app`

## Core Product Flow

1. Browse templates (`/templates`)
2. Create draft in Firestore (`status: pending`)
3. Customize content in builder (`/create/:templateId?draft=...`)
4. Preview paywall step (`/preview/:draftId`)
5. Pay (Stripe checkout via Cloud Functions)
6. Verify payment and activate page (`status: active`)
7. Share recipient link (`/p/:id`)

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Database: Firebase Firestore
- Backend: Firebase Cloud Functions (Node.js)
- Payments: Stripe
- Image hosting: Cloudinary (unsigned preset uploads)
- Hosting: Firebase Hosting

## Project Structure

```txt
src/
  components/     shared UI
  pages/          route-level pages
  templates/      recipient template experiences
  utils/          helper functions
functions/
  index.js        checkout, verifyPayment, cleanup
firebase.json
firestore.rules
```

## Environment Variables

Copy `.env.example` to `.env` in project root and fill values:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_APP_URL=https://loveletters-7612c.web.app
```

## Local Development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Firebase Setup Notes

- Firestore rules and indexes are deployed from:
  - `firestore.rules`
  - `firestore.indexes.json`
- Cloud Functions deployment requires Blaze plan (billing enabled).
- Functions runtime config currently uses:
  - `app.url`
  - `stripe.secret`

## Cloudinary Setup Notes

- Create an **unsigned upload preset** in Cloudinary.
- Set:
  - `VITE_CLOUDINARY_CLOUD_NAME`
  - `VITE_CLOUDINARY_UPLOAD_PRESET`
- Images uploaded in builder are saved to Cloudinary and stored as URLs in draft/page data.

## Important Security Note

Never expose Stripe secret keys or Cloudinary API secrets in frontend code or `.env` variables prefixed with `VITE_`.

## Current Status

Implemented:
- template selection and builder flow
- Firestore draft persistence
- Cloudinary image upload in builder
- recipient template rendering
- hosting deployment

In progress / next:
- Stripe end-to-end activation flow finalization
- lint cleanup and code quality pass
- performance/code-splitting improvements
- test coverage

## License

Private project (all rights reserved unless changed by repository owner).

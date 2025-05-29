# Image Text Extractor Web

A modern Next.js web application for extracting text from images using a backend API and S3 storage. Built with TypeScript, React, and best practices for security and maintainability.

<img width="596" alt="image" src="https://github.com/user-attachments/assets/df4296f1-93e4-4b41-b3b1-bcfeb6d2e315" />

## Features

- Upload images or provide an image URL to extract text instantly
- Secure server-side API routes for backend communication (credentials are never exposed to the client)
- Direct-to-S3 uploads using pre-signed URLs (pre-signed URLs are obtained from another backend)
- Robust error handling and type safety
- Tested with Jest and node-mocks-http
- Beautiful, responsive UI with Tailwind CSS

## Getting Started

### 1. Install dependencies

```bash
pnpm install
# or
yarn install
# or
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root with your backend and authentication details:

```
BACKEND_HOST=http://your-backend-url
AUTH_USER=youruser
AUTH_PASSWORD=yourpassword
```

### 3. Run the development server

```bash
pnpm dev
# or
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Testing

Run all tests (unit and API):

```bash
pnpm test
# or
yarn test
# or
npm test
```

- UI tests are in progress
- API route tests are in `src/pages/api/__tests__/api.test.ts`

## Project Structure

- `src/app/page.tsx` — Main UI and logic
- `src/pages/api/` — API routes for backend/S3 communication
- `src/types/api.ts` — Shared TypeScript types for API responses
- `src/app/components/` — UI components

## License

MIT

# Electoral Data Extract - Frontend

Next.js frontend application for the Electoral Data Extraction system. This application provides a modern web interface for managing electoral documents, extracting voter data, and viewing extraction results.

## Tech Stack

- **Framework**: Next.js 16.0.3
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Prerequisites

- Node.js 20.x or higher
- npm or pnpm
- Backend API running (default: `http://localhost:8000`)

## Installation

1. Install dependencies:

```bash
npm install
# or
pnpm install
```

2. Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

For production, set this to your backend API URL.

## Development

Run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

Build the application for production:

```bash
npm run build
# or
pnpm build
```

Start the production server:

```bash
npm start
# or
pnpm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js app directory (pages)
│   ├── documents/         # Document management pages
│   ├── voters/            # Voter data pages
│   ├── runs/              # Extraction runs pages
│   └── settings/          # Settings page
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   ├── common/           # Common shared components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and API client
│   ├── api.ts           # API client functions
│   ├── types.ts         # TypeScript type definitions
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

## Features

- **Document Management**: Upload and manage electoral roll PDF documents
- **Voter Data**: View and filter extracted voter information
- **Extraction Runs**: Monitor extraction progress and results
- **Settings**: Configure API keys and application settings
- **Real-time Updates**: Live status updates for extraction processes
- **Responsive Design**: Mobile-friendly interface

## API Integration

The frontend communicates with the FastAPI backend through the API client in `lib/api.ts`. The base URL is configured via the `NEXT_PUBLIC_API_BASE_URL` environment variable.

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Backend API base URL (default: `http://localhost:8000/api/v1`)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

For deployment instructions, see the main project README or deployment documentation.

## License

Private project - not for public distribution.


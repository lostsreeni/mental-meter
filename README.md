# MentalMeter

## About the Project

MentalMeter is a privacy-first, fully offline-capable mental health tracking application. It is designed to provide users with validated psychological instruments (such as PHQ-2, GAD-2, PHQ-9, GAD-7, and WHO-5) without compromising their data privacy.

**Key Features & Privacy Constraints:**
- **Zero Analytics & No Cookies:** Completely private experience with no tracking.
- **Strictly Offline-Capable:** Operates entirely locally with a service worker. No external network requests are made.
- **On-Device Data Architecture:** All data is strictly stored on-device using IndexedDB (via Dexie.js) with optional WebCrypto AES-GCM encryption.
- **Safety Protocol:** Implements crisis resource direction if users indicate self-harm on the PHQ-9 assessment, displaying non-alarming support information.
- **No Gamification:** Follows strict product rules avoiding streaks, badges, or other gamification features, maintaining the focus on accurate and clinical assessment.

**Tech Stack:**
- Framework: Next.js (App Router), fully static export with no backend.
- Language: TypeScript.
- Styling: Tailwind CSS & shadcn/ui.
- Core Libraries: Dexie.js (IndexedDB storage), jsPDF & jspdf-autotable (client-side PDF generation), and Recharts (charting).

## Setup the Project

### Prerequisites
- **Node.js**: The project uses Node 20 LTS. We recommend using `nvm` (Node Version Manager) to ensure you are running the correct version as pinned in the `.nvmrc` file.

```bash
nvm use
```

### Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production Build & Testing

MentalMeter is deployed as a fully static export. To test the production build locally:

1. Build the application:

```bash
npm run build
```

2. Serve the exported static files:

```bash
npm run serve
```
This script runs `npx serve out` to locally test the statically exported production build.

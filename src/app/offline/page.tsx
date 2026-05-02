export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-sm">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
            aria-hidden="true"
          >
            <line x1="2" y1="2" x2="22" y2="22" />
            <path d="M8.5 16.5a5 5 0 0 1 7 0" />
            <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
            <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" />
            <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" />
            <path d="M5 12.85a10 10 0 0 1 5.17-2.39" />
            <circle cx="12" cy="20" r="1" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-3">
          You&apos;re offline
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-8">
          This page isn&apos;t available without a connection. The rest of MindMeter
          works offline — try navigating back.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center min-h-11 px-6 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Go to home
        </a>
      </div>
    </div>
  )
}

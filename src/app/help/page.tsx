import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { crisisResources, internationalFallback } from '@/lib/crisis/resources'

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center px-4 pt-4 pb-2">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Back to home"
        >
          <ChevronLeft size={20} />
        </Link>
      </div>

      <div className="flex-1 flex flex-col px-6 py-6 max-w-lg mx-auto w-full gap-8">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold text-foreground">Get help</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            If you&apos;re having a hard time, these services are free, confidential, and available any time of day or night.
          </p>
        </div>

        {/* US primary resources */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            United States
          </h2>
          <a
            href="tel:988"
            className="flex flex-col gap-0.5 min-h-[4rem] px-5 py-4 rounded-2xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80"
          >
            <span className="text-base font-semibold">Call or text 988</span>
            <span className="text-sm opacity-80">Suicide &amp; Crisis Lifeline — 24/7, free, confidential</span>
          </a>
          <a
            href="sms:741741?body=HOME"
            className="flex flex-col gap-0.5 min-h-[4rem] px-5 py-4 rounded-2xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80"
          >
            <span className="text-base font-semibold">Text HOME to 741741</span>
            <span className="text-sm opacity-80">Crisis Text Line — available 24/7</span>
          </a>
        </div>

        {/* International resources */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Other countries
          </h2>
          {crisisResources.slice(1).map((region) => (
            <div key={region.country} className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                {region.country}
              </p>
              {region.services.map((service) => (
                <a
                  key={service.name}
                  href={service.phoneHref ?? service.smsHref ?? '#'}
                  className="flex flex-col gap-0.5 min-h-[3.5rem] px-4 py-3 rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent"
                >
                  <span className="text-sm font-medium">{service.name}</span>
                  <span className="text-xs text-muted-foreground">{service.detail}</span>
                </a>
              ))}
            </div>
          ))}

          {/* Worldwide fallback */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Everywhere else
            </p>
            <a
              href={internationalFallback.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-0.5 min-h-[3.5rem] px-4 py-3 rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent"
            >
              <span className="text-sm font-medium">{internationalFallback.name}</span>
              <span className="text-xs text-muted-foreground">{internationalFallback.detail}</span>
            </a>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed pb-2">
          Phone numbers were last verified May 2026. If a number has changed, please check the service&apos;s official website.
        </p>
      </div>
    </div>
  )
}

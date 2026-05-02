import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card"
import { ProgressDots } from "@/components/ui/ProgressDots"
import DesignInteractive from "./DesignInteractive"

export default function DesignPage() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <header>
          <h1 className="text-3xl font-bold text-foreground mb-2">Design System</h1>
          <p className="text-muted-foreground">Visual regression reference — development only.</p>
        </header>

        {/* Colors */}
        <section aria-labelledby="colors-heading">
          <h2 id="colors-heading" className="text-xl font-semibold text-foreground mb-4">Color System</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: "Background", cls: "bg-background border border-border" },
              { label: "Card", cls: "bg-card border border-border" },
              { label: "Primary", cls: "bg-primary" },
              { label: "Secondary", cls: "bg-secondary border border-border" },
              { label: "Muted", cls: "bg-muted" },
              { label: "Accent", cls: "bg-accent border border-border" },
              { label: "Severity Minimal", cls: "bg-[var(--severity-minimal)]" },
              { label: "Severity Mild", cls: "bg-[var(--severity-mild)]" },
              { label: "Severity Moderate", cls: "bg-[var(--severity-moderate)]" },
              { label: "Severity Severe", cls: "bg-[var(--severity-severe)]" },
              { label: "Destructive", cls: "bg-destructive/20" },
              { label: "Border", cls: "border-4 border-border" },
            ].map(({ label, cls }) => (
              <div key={label} className="space-y-1">
                <div className={`h-12 rounded-xl ${cls}`} />
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section aria-labelledby="typography-heading">
          <h2 id="typography-heading" className="text-xl font-semibold text-foreground mb-4">Typography</h2>
          <div className="space-y-3">
            <p className="text-4xl font-bold text-foreground">Heading 4xl Bold</p>
            <p className="text-3xl font-semibold text-foreground">Heading 3xl Semibold</p>
            <p className="text-2xl font-semibold text-foreground">Heading 2xl Semibold</p>
            <p className="text-xl font-medium text-foreground">Heading xl Medium</p>
            <p className="text-lg font-medium text-foreground">Question prompt — text-lg medium</p>
            <p className="text-base text-foreground leading-relaxed">Body text — text-base, leading-relaxed. The quick brown fox jumps over the lazy dog.</p>
            <p className="text-sm text-muted-foreground">Small / caption — text-sm muted</p>
            <p className="text-xs text-muted-foreground">Extra small — text-xs muted</p>
          </div>
        </section>

        {/* Buttons */}
        <section aria-labelledby="buttons-heading">
          <h2 id="buttons-heading" className="text-xl font-semibold text-foreground mb-4">Buttons</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="default">Default (44px)</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button disabled>Disabled</Button>
              <Button variant="outline" disabled>Disabled Outline</Button>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section aria-labelledby="cards-heading">
          <h2 id="cards-heading" className="text-xl font-semibold text-foreground mb-4">Cards</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>A simple card with header and content.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Card body content goes here. Generous padding and soft shadow.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Card with Footer</CardTitle>
                <CardDescription>With actions in the footer area.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Content area.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">Cancel</Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Progress Dots */}
        <section aria-labelledby="progress-heading">
          <h2 id="progress-heading" className="text-xl font-semibold text-foreground mb-4">Progress Dots</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Step 1 of 5</p>
              <ProgressDots total={5} current={0} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Step 3 of 5</p>
              <ProgressDots total={5} current={2} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Step 5 of 5</p>
              <ProgressDots total={5} current={4} />
            </div>
          </div>
        </section>

        {/* Interactive components (client) */}
        <DesignInteractive />
      </div>
    </div>
  )
}

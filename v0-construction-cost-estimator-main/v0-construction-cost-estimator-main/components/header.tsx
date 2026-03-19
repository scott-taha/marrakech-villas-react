import { Building2 } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold tracking-tight text-foreground">
              BuildEstimate
            </h1>
            <p className="text-xs text-muted-foreground">Professional Cost Calculator</p>
          </div>
        </div>
        <div className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          <span>Free consultation</span>
          <span className="h-4 w-px bg-border" />
          <span>No commitment</span>
        </div>
      </div>
    </header>
  )
}

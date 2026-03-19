import { ShieldCheck, Clock, Users, Lock } from "lucide-react"

const indicators = [
  {
    icon: ShieldCheck,
    title: "15+ Years Experience",
    description: "Trusted by thousands of homeowners"
  },
  {
    icon: Clock,
    title: "Instant Estimate",
    description: "Get your quote in under 2 minutes"
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Certified construction professionals"
  },
  {
    icon: Lock,
    title: "100% Confidential",
    description: "Your data is secure with us"
  }
]

export function TrustIndicators() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {indicators.map((indicator) => (
          <div key={indicator.title} className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <indicator.icon className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{indicator.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{indicator.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

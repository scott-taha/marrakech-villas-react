"use client"

import { Building, PaintBucket, Waves, Fence, TreeDeciduous, Phone, Mail, MapPin, RotateCcw, CheckCircle2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { EstimatorData } from "@/app/page"

interface StepSummaryProps {
  data: EstimatorData
  onBack: () => void
  onRestart: () => void
}

const BASE_PRICES = {
  "gros-oeuvre": 1200,
  "second-oeuvre": 800
}

const FINISHING_MULTIPLIERS = {
  simple: 1,
  "high-end": 1.4,
  luxury: 2
}

const POOL_PRICES = { liner: 400, tiles: 600, mosaic: 900 }
const FENCE_PRICES = { wire: 50, wood: 120, aluminum: 180, "wrought-iron": 250 }
const GARDEN_PRICES = { lawn: 25, landscaped: 60, mediterranean: 80 }

export function StepSummary({ data, onBack, onRestart }: StepSummaryProps) {
  const basePrice = data.constructionType ? BASE_PRICES[data.constructionType] : 1000
  const finishingMultiplier = data.finishingLevel ? FINISHING_MULTIPLIERS[data.finishingLevel] : 1
  const floorMultiplier = 1 + (data.floors - 1) * 0.15

  const constructionCost = data.surfaceArea * basePrice * finishingMultiplier * floorMultiplier

  const poolCost = data.extras.pool.enabled
    ? data.extras.pool.surface * POOL_PRICES[data.extras.pool.finishType]
    : 0

  const fenceCost = data.extras.fence.enabled
    ? data.extras.fence.length * FENCE_PRICES[data.extras.fence.type]
    : 0

  const gardenCost = data.extras.garden.enabled
    ? data.extras.garden.surface * GARDEN_PRICES[data.extras.garden.style]
    : 0

  const totalCost = constructionCost + poolCost + fenceCost + gardenCost

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(amount)

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Success Header */}
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent">
          <CheckCircle2 className="h-10 w-10 text-accent-foreground" />
        </div>
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Thank you, {data.contact.name.split(" ")[0]}!
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Your detailed estimate is ready. We&apos;ll send a complete breakdown to your email shortly.
        </p>
      </div>

      {/* Total Estimate Card */}
      <div className="mx-auto mt-10 max-w-2xl">
        <div className="rounded-2xl bg-primary p-8 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/70">
            Total Estimated Cost
          </p>
          <p className="mt-2 font-serif text-5xl font-bold text-primary-foreground sm:text-6xl">
            {formatCurrency(totalCost)}
          </p>
          <p className="mt-3 text-sm text-primary-foreground/70">
            Including all selected options
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mx-auto mt-8 max-w-2xl space-y-4">
        <h3 className="font-semibold text-foreground">Cost Breakdown</h3>
        
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {/* Main Construction */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                {data.constructionType === "gros-oeuvre" ? (
                  <Building className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <PaintBucket className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {data.constructionType === "gros-oeuvre" ? "Structural Work" : "Finishing Work"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {data.surfaceArea}m² • {data.floors} floor{data.floors > 1 ? "s" : ""} • {data.finishingLevel} finish
                </p>
              </div>
            </div>
            <span className="font-semibold text-foreground">{formatCurrency(constructionCost)}</span>
          </div>

          {/* Pool */}
          {data.extras.pool.enabled && (
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Waves className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Swimming Pool</p>
                  <p className="text-sm text-muted-foreground">
                    {data.extras.pool.surface}m² • {data.extras.pool.finishType} finish
                  </p>
                </div>
              </div>
              <span className="font-semibold text-foreground">{formatCurrency(poolCost)}</span>
            </div>
          )}

          {/* Fence */}
          {data.extras.fence.enabled && (
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Fence className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Perimeter Fence</p>
                  <p className="text-sm text-muted-foreground">
                    {data.extras.fence.length}m • {data.extras.fence.type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-foreground">{formatCurrency(fenceCost)}</span>
            </div>
          )}

          {/* Garden */}
          {data.extras.garden.enabled && (
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <TreeDeciduous className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Garden Landscaping</p>
                  <p className="text-sm text-muted-foreground">
                    {data.extras.garden.surface}m² • {data.extras.garden.style} style
                  </p>
                </div>
              </div>
              <span className="font-semibold text-foreground">{formatCurrency(gardenCost)}</span>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Important:</strong> This is an estimate based on average market prices and your selections. 
            Final pricing will depend on technical requirements, site conditions, material availability, and labor costs in your area. 
            A detailed quote will be provided after our consultation.
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mx-auto mt-10 max-w-2xl">
        <h3 className="font-semibold text-foreground mb-4">What happens next?</h3>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Mail className="h-5 w-5 text-accent" />
              </div>
              <p className="font-medium text-foreground">Check your email</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We&apos;ll send your detailed estimate to {data.contact.email}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Phone className="h-5 w-5 text-accent" />
              </div>
              <p className="font-medium text-foreground">Free consultation</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Our expert will call you at {data.contact.phone}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <p className="font-medium text-foreground">Site visit</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Schedule a free on-site evaluation in {data.contact.city}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="mx-auto mt-10 max-w-2xl">
        <div className="flex flex-col items-center gap-4 rounded-xl bg-accent/10 p-8 text-center">
          <MapPin className="h-8 w-8 text-accent" />
          <h3 className="font-serif text-xl font-semibold text-foreground">
            Ready to start your project?
          </h3>
          <p className="text-muted-foreground">
            Our construction experts are available to discuss your project in detail.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <Phone className="h-4 w-4" />
              Call us now
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Mail className="h-4 w-4" />
              Send us a message
            </Button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onRestart}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          Start a new estimate
        </Button>
      </div>
    </div>
  )
}

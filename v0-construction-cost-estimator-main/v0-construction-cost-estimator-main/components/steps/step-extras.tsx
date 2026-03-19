"use client"

import { ArrowLeft, ArrowRight, ChevronDown, Waves, Fence, TreeDeciduous } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import type { EstimatorData } from "@/app/page"
import { useState } from "react"

interface StepExtrasProps {
  data: EstimatorData
  updateData: (updates: Partial<EstimatorData>) => void
  onNext: () => void
  onBack: () => void
}

const POOL_PRICES = {
  liner: 400,
  tiles: 600,
  mosaic: 900
}

const FENCE_PRICES = {
  wire: 50,
  wood: 120,
  aluminum: 180,
  "wrought-iron": 250
}

const GARDEN_PRICES = {
  lawn: 25,
  landscaped: 60,
  mediterranean: 80
}

export function StepExtras({ data, updateData, onNext, onBack }: StepExtrasProps) {
  const [openSections, setOpenSections] = useState<string[]>([])

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const updateExtra = <K extends keyof EstimatorData["extras"]>(
    key: K,
    updates: Partial<EstimatorData["extras"][K]>
  ) => {
    updateData({
      extras: {
        ...data.extras,
        [key]: { ...data.extras[key], ...updates }
      }
    })
  }

  const poolEstimate = data.extras.pool.enabled
    ? data.extras.pool.surface * POOL_PRICES[data.extras.pool.finishType]
    : 0

  const fenceEstimate = data.extras.fence.enabled
    ? data.extras.fence.length * FENCE_PRICES[data.extras.fence.type]
    : 0

  const gardenEstimate = data.extras.garden.enabled
    ? data.extras.garden.surface * GARDEN_PRICES[data.extras.garden.style]
    : 0

  const totalExtrasEstimate = poolEstimate + fenceEstimate + gardenEstimate

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Add optional features
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Enhance your project with additional features. All extras are optional.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl space-y-4">
        {/* Swimming Pool */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("pool")}
            className="flex w-full items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                data.extras.pool.enabled ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              )}>
                <Waves className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Swimming Pool</h3>
                <p className="text-sm text-muted-foreground">
                  {data.extras.pool.enabled
                    ? `${data.extras.pool.surface}m² • ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(poolEstimate)}`
                    : "Add a pool to your project"}
                </p>
              </div>
            </div>
            <ChevronDown className={cn(
              "h-5 w-5 text-muted-foreground transition-transform",
              openSections.includes("pool") && "rotate-180"
            )} />
          </button>
          
          {openSections.includes("pool") && (
            <div className="border-t border-border px-6 py-6 space-y-6">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-foreground">Include swimming pool</span>
                <button
                  type="button"
                  onClick={() => updateExtra("pool", { enabled: !data.extras.pool.enabled })}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    data.extras.pool.enabled ? "bg-accent" : "bg-muted"
                  )}
                >
                  <span className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                    data.extras.pool.enabled ? "left-[22px]" : "left-0.5"
                  )} />
                </button>
              </label>

              {data.extras.pool.enabled && (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Pool surface</span>
                      <span className="font-medium text-foreground">{data.extras.pool.surface} m²</span>
                    </div>
                    <Slider
                      value={[data.extras.pool.surface]}
                      onValueChange={([value]) => updateExtra("pool", { surface: value })}
                      min={20}
                      max={80}
                      step={2}
                    />
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground mb-3 block">Finish type</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(["liner", "tiles", "mosaic"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => updateExtra("pool", { finishType: type })}
                          className={cn(
                            "rounded-lg border p-3 text-center text-sm font-medium transition-colors",
                            data.extras.pool.finishType === type
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-border text-foreground hover:border-accent/50"
                          )}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Fence */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("fence")}
            className="flex w-full items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                data.extras.fence.enabled ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              )}>
                <Fence className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Perimeter Fence</h3>
                <p className="text-sm text-muted-foreground">
                  {data.extras.fence.enabled
                    ? `${data.extras.fence.length}m • ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(fenceEstimate)}`
                    : "Add fencing around your property"}
                </p>
              </div>
            </div>
            <ChevronDown className={cn(
              "h-5 w-5 text-muted-foreground transition-transform",
              openSections.includes("fence") && "rotate-180"
            )} />
          </button>
          
          {openSections.includes("fence") && (
            <div className="border-t border-border px-6 py-6 space-y-6">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-foreground">Include fence</span>
                <button
                  type="button"
                  onClick={() => updateExtra("fence", { enabled: !data.extras.fence.enabled })}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    data.extras.fence.enabled ? "bg-accent" : "bg-muted"
                  )}
                >
                  <span className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                    data.extras.fence.enabled ? "left-[22px]" : "left-0.5"
                  )} />
                </button>
              </label>

              {data.extras.fence.enabled && (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Fence length</span>
                      <span className="font-medium text-foreground">{data.extras.fence.length} m</span>
                    </div>
                    <Slider
                      value={[data.extras.fence.length]}
                      onValueChange={([value]) => updateExtra("fence", { length: value })}
                      min={20}
                      max={200}
                      step={5}
                    />
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground mb-3 block">Fence type</span>
                    <div className="grid grid-cols-2 gap-2">
                      {(["wire", "wood", "aluminum", "wrought-iron"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => updateExtra("fence", { type })}
                          className={cn(
                            "rounded-lg border p-3 text-center text-sm font-medium transition-colors",
                            data.extras.fence.type === type
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-border text-foreground hover:border-accent/50"
                          )}
                        >
                          {type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Garden */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("garden")}
            className="flex w-full items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                data.extras.garden.enabled ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              )}>
                <TreeDeciduous className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Garden Landscaping</h3>
                <p className="text-sm text-muted-foreground">
                  {data.extras.garden.enabled
                    ? `${data.extras.garden.surface}m² • ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(gardenEstimate)}`
                    : "Add professional landscaping"}
                </p>
              </div>
            </div>
            <ChevronDown className={cn(
              "h-5 w-5 text-muted-foreground transition-transform",
              openSections.includes("garden") && "rotate-180"
            )} />
          </button>
          
          {openSections.includes("garden") && (
            <div className="border-t border-border px-6 py-6 space-y-6">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-foreground">Include garden</span>
                <button
                  type="button"
                  onClick={() => updateExtra("garden", { enabled: !data.extras.garden.enabled })}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    data.extras.garden.enabled ? "bg-accent" : "bg-muted"
                  )}
                >
                  <span className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                    data.extras.garden.enabled ? "left-[22px]" : "left-0.5"
                  )} />
                </button>
              </label>

              {data.extras.garden.enabled && (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Garden surface</span>
                      <span className="font-medium text-foreground">{data.extras.garden.surface} m²</span>
                    </div>
                    <Slider
                      value={[data.extras.garden.surface]}
                      onValueChange={([value]) => updateExtra("garden", { surface: value })}
                      min={50}
                      max={500}
                      step={10}
                    />
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground mb-3 block">Garden style</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(["lawn", "landscaped", "mediterranean"] as const).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => updateExtra("garden", { style })}
                          className={cn(
                            "rounded-lg border p-3 text-center text-sm font-medium transition-colors",
                            data.extras.garden.style === style
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-border text-foreground hover:border-accent/50"
                          )}
                        >
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Extras Total */}
        {totalExtrasEstimate > 0 && (
          <div className="rounded-xl bg-primary/5 p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Extras total</span>
              <span className="font-serif text-xl font-bold text-foreground">
                +{new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(totalExtrasEstimate)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

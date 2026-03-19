"use client"

import { ArrowLeft, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { EstimatorData } from "@/app/page"

interface StepFinishingLevelProps {
  data: EstimatorData
  updateData: (updates: Partial<EstimatorData>) => void
  onNext: () => void
  onBack: () => void
}

const finishingLevels = [
  {
    id: "simple" as const,
    title: "Simple",
    priceIndicator: "€",
    multiplier: 1,
    description: "Standard materials and finishes for practical, budget-conscious projects.",
    features: [
      "Standard quality materials",
      "Basic fixtures and fittings",
      "Functional design focus",
      "Cost-effective solutions"
    ],
    popular: false
  },
  {
    id: "high-end" as const,
    title: "High-End",
    priceIndicator: "€€",
    multiplier: 1.4,
    description: "Premium materials and modern finishes for a sophisticated, comfortable home.",
    features: [
      "Premium quality materials",
      "Designer fixtures & fittings",
      "Enhanced insulation",
      "Smart home ready"
    ],
    popular: true
  },
  {
    id: "luxury" as const,
    title: "Luxury",
    priceIndicator: "€€€",
    multiplier: 2,
    description: "Exclusive materials and bespoke finishes for an exceptional living experience.",
    features: [
      "Exclusive, imported materials",
      "Custom-designed elements",
      "Full home automation",
      "Architectural details"
    ],
    popular: false
  }
]

export function StepFinishingLevel({ data, updateData, onNext, onBack }: StepFinishingLevelProps) {
  const handleSelect = (level: "simple" | "high-end" | "luxury") => {
    updateData({ finishingLevel: level })
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Choose your finishing level
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Select the quality level that matches your vision and budget expectations.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {finishingLevels.map((level) => (
          <button
            key={level.id}
            type="button"
            onClick={() => handleSelect(level.id)}
            className={cn(
              "group relative flex flex-col rounded-xl border-2 bg-card p-6 text-left transition-all duration-300 hover:shadow-lg",
              data.finishingLevel === level.id
                ? "border-accent shadow-lg"
                : "border-border hover:border-accent/50",
              level.popular && "lg:-mt-4 lg:mb-4"
            )}
          >
            {level.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                  <Star className="h-3 w-3 fill-current" />
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {level.title}
                </h3>
                <p className="text-lg font-bold text-accent">{level.priceIndicator}</p>
              </div>
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
                  data.finishingLevel === level.id
                    ? "border-accent bg-accent"
                    : "border-muted"
                )}
              >
                {data.finishingLevel === level.id && (
                  <svg
                    className="h-3 w-3 text-accent-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {level.description}
            </p>

            <ul className="mt-6 flex-1 space-y-3">
              {level.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                  <svg
                    className="h-4 w-4 shrink-0 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
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
          disabled={!data.finishingLevel}
          className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

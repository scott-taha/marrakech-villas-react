"use client"

import { ArrowLeft, ArrowRight, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { EstimatorData } from "@/app/page"

interface StepDimensionsProps {
  data: EstimatorData
  updateData: (updates: Partial<EstimatorData>) => void
  onNext: () => void
  onBack: () => void
}

const BASE_PRICES = {
  "gros-oeuvre": 1200,
  "second-oeuvre": 800
}

export function StepDimensions({ data, updateData, onNext, onBack }: StepDimensionsProps) {
  const basePrice = data.constructionType ? BASE_PRICES[data.constructionType] : 1000
  const partialEstimate = data.surfaceArea * basePrice * (1 + (data.floors - 1) * 0.15)

  const adjustFloors = (delta: number) => {
    const newFloors = Math.max(1, Math.min(5, data.floors + delta))
    updateData({ floors: newFloors })
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Tell us about your project dimensions
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          These measurements help us calculate a more accurate estimate for your construction project.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl space-y-10">
        {/* Surface Area */}
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Total Surface Area</h3>
              <p className="text-sm text-muted-foreground">The total built area in square meters</p>
            </div>
            <div className="text-right">
              <span className="font-serif text-3xl font-bold text-foreground">{data.surfaceArea}</span>
              <span className="ml-1 text-lg text-muted-foreground">m²</span>
            </div>
          </div>
          <div className="mt-6">
            <Slider
              value={[data.surfaceArea]}
              onValueChange={([value]) => updateData({ surfaceArea: value })}
              min={50}
              max={500}
              step={10}
              className="w-full"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>50 m²</span>
              <span>500 m²</span>
            </div>
          </div>
        </div>

        {/* Number of Floors */}
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Number of Floors</h3>
              <p className="text-sm text-muted-foreground">Including ground floor</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => adjustFloors(-1)}
                disabled={data.floors <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-serif text-3xl font-bold text-foreground">{data.floors}</span>
              <button
                type="button"
                onClick={() => adjustFloors(1)}
                disabled={data.floors >= 5}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((floor) => (
              <button
                key={floor}
                type="button"
                onClick={() => updateData({ floors: floor })}
                className={`h-2 w-8 rounded-full transition-colors ${
                  floor <= data.floors ? "bg-accent" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Partial Estimate Preview */}
        <div className="rounded-xl bg-primary/5 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Starting estimate</p>
              <p className="text-xs text-muted-foreground">
                Based on {data.constructionType === "gros-oeuvre" ? "structural" : "finishing"} work
              </p>
            </div>
            <div className="text-right">
              <p className="font-serif text-2xl font-bold text-foreground">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0
                }).format(partialEstimate)}
              </p>
              <p className="text-xs text-muted-foreground">Estimate only • More options ahead</p>
            </div>
          </div>
        </div>
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

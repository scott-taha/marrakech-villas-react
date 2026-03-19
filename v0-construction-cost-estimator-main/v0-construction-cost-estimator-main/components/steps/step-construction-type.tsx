"use client"

import { Building, PaintBucket } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EstimatorData } from "@/app/page"

interface StepConstructionTypeProps {
  data: EstimatorData
  updateData: (updates: Partial<EstimatorData>) => void
  onNext: () => void
}

const constructionTypes = [
  {
    id: "gros-oeuvre" as const,
    icon: Building,
    title: "Gros Œuvre",
    subtitle: "Structural Work",
    description: "Foundation, walls, roofing, and primary structural elements of your building.",
    examples: "Includes: foundations, load-bearing walls, concrete work, roof structure"
  },
  {
    id: "second-oeuvre" as const,
    icon: PaintBucket,
    title: "Second Œuvre",
    subtitle: "Finishing Work",
    description: "Interior finishing, installations, and aesthetic elements of your project.",
    examples: "Includes: plumbing, electrical, plastering, painting, flooring, fixtures"
  }
]

export function StepConstructionType({ data, updateData, onNext }: StepConstructionTypeProps) {
  const handleSelect = (type: "gros-oeuvre" | "second-oeuvre") => {
    updateData({ constructionType: type })
    setTimeout(() => onNext(), 300)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          What type of construction are you planning?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Select the category that best describes your project. This helps us provide an accurate estimate.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {constructionTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => handleSelect(type.id)}
            className={cn(
              "group relative rounded-xl border-2 bg-card p-8 text-left transition-all duration-300 hover:shadow-lg",
              data.constructionType === type.id
                ? "border-accent shadow-lg"
                : "border-border hover:border-accent/50"
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-colors duration-300",
                  data.constructionType === type.id
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"
                )}
              >
                <type.icon className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {type.title}
                </h3>
                <p className="text-sm font-medium text-accent">{type.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {type.description}
                </p>
                <p className="mt-3 text-xs text-muted-foreground/80">
                  {type.examples}
                </p>
              </div>
            </div>
            {data.constructionType === type.id && (
              <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                <svg
                  className="h-4 w-4 text-accent-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        You can adjust this later if needed.
      </p>
    </div>
  )
}

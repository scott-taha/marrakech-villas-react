"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ProgressIndicator } from "@/components/progress-indicator"
import { StepConstructionType } from "@/components/steps/step-construction-type"
import { StepDimensions } from "@/components/steps/step-dimensions"
import { StepFinishingLevel } from "@/components/steps/step-finishing-level"
import { StepExtras } from "@/components/steps/step-extras"
import { StepContact } from "@/components/steps/step-contact"
import { StepSummary } from "@/components/steps/step-summary"
import { TrustIndicators } from "@/components/trust-indicators"

export interface EstimatorData {
  constructionType: "gros-oeuvre" | "second-oeuvre" | null
  surfaceArea: number
  floors: number
  finishingLevel: "simple" | "high-end" | "luxury" | null
  extras: {
    pool: {
      enabled: boolean
      surface: number
      finishType: "liner" | "tiles" | "mosaic"
    }
    fence: {
      enabled: boolean
      length: number
      type: "wire" | "wood" | "aluminum" | "wrought-iron"
    }
    garden: {
      enabled: boolean
      surface: number
      style: "lawn" | "landscaped" | "mediterranean"
    }
  }
  contact: {
    name: string
    phone: string
    email: string
    city: string
  }
}

const STEPS = [
  "Construction Type",
  "Dimensions",
  "Finishing Level",
  "Optional Extras",
  "Contact Info",
  "Estimate"
]

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<EstimatorData>({
    constructionType: null,
    surfaceArea: 150,
    floors: 1,
    finishingLevel: null,
    extras: {
      pool: { enabled: false, surface: 32, finishType: "liner" },
      fence: { enabled: false, length: 50, type: "wire" },
      garden: { enabled: false, surface: 200, style: "lawn" }
    },
    contact: { name: "", phone: "", email: "", city: "" }
  })

  const updateData = (updates: Partial<EstimatorData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepConstructionType
            data={data}
            updateData={updateData}
            onNext={nextStep}
          />
        )
      case 1:
        return (
          <StepDimensions
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 2:
        return (
          <StepFinishingLevel
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 3:
        return (
          <StepExtras
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 4:
        return (
          <StepContact
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 5:
        return (
          <StepSummary
            data={data}
            onBack={prevStep}
            onRestart={() => {
              setCurrentStep(0)
              setData({
                constructionType: null,
                surfaceArea: 150,
                floors: 1,
                finishingLevel: null,
                extras: {
                  pool: { enabled: false, surface: 32, finishType: "liner" },
                  fence: { enabled: false, length: 50, type: "wire" },
                  garden: { enabled: false, surface: 200, style: "lawn" }
                },
                contact: { name: "", phone: "", email: "", city: "" }
              })
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <ProgressIndicator steps={STEPS} currentStep={currentStep} />
        <div className="mt-8">
          {renderStep()}
        </div>
        {currentStep < 5 && (
          <div className="mt-12">
            <TrustIndicators />
          </div>
        )}
      </div>
    </main>
  )
}

"use client"

import React from "react"

import { ArrowLeft, Gift, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { EstimatorData } from "@/app/page"

interface StepContactProps {
  data: EstimatorData
  updateData: (updates: Partial<EstimatorData>) => void
  onNext: () => void
  onBack: () => void
}

export function StepContact({ data, updateData, onNext, onBack }: StepContactProps) {
  const updateContact = (field: keyof EstimatorData["contact"], value: string) => {
    updateData({
      contact: { ...data.contact, [field]: value }
    })
  }

  const isValid =
    data.contact.name.trim().length >= 2 &&
    data.contact.phone.trim().length >= 8 &&
    data.contact.email.includes("@") &&
    data.contact.city.trim().length >= 2

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onNext()
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <Sparkles className="h-8 w-8 text-accent" />
        </div>
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Your estimate is ready!
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Enter your details to receive a detailed breakdown and a free expert consultation.
        </p>
      </div>

      {/* Benefits */}
      <div className="mx-auto mt-8 max-w-md">
        <div className="flex flex-col gap-4 rounded-xl bg-primary/5 p-6">
          <div className="flex items-center gap-3">
            <Gift className="h-5 w-5 text-accent" />
            <span className="text-sm text-foreground">Detailed cost breakdown by email</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <span className="text-sm text-foreground">Free 30-minute consultation call</span>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-sm text-foreground">No commitment, no spam</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Jean Dupont"
            value={data.contact.name}
            onChange={(e) => updateContact("name", e.target.value)}
            className="h-12 bg-card"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+33 6 12 34 56 78"
            value={data.contact.phone}
            onChange={(e) => updateContact("phone", e.target.value)}
            className="h-12 bg-card"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="jean.dupont@email.com"
            value={data.contact.email}
            onChange={(e) => updateContact("email", e.target.value)}
            className="h-12 bg-card"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-foreground">City / Region</Label>
          <Input
            id="city"
            type="text"
            placeholder="Paris, Île-de-France"
            value={data.contact.city}
            onChange={(e) => updateContact("city", e.target.value)}
            className="h-12 bg-card"
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={!isValid}
            className="h-14 w-full gap-2 bg-accent text-lg font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
          >
            <Sparkles className="h-5 w-5" />
            See My Detailed Estimate
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By submitting, you agree to receive your estimate and a follow-up call from our team.
          We respect your privacy and never share your data.
        </p>
      </form>

      <div className="mt-8 text-center">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to extras
        </Button>
      </div>
    </div>
  )
}

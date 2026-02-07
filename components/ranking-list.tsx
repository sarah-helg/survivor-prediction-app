"use client"

import { useState, useCallback } from "react"
import { Reorder, AnimatePresence } from "framer-motion"
import { DraggableContestant } from "@/components/draggable-contestant"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Save, RotateCcw, Loader2, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Contestant } from "@/lib/db"

interface RankingListProps {
  initialContestants: Contestant[]
}

export function RankingList({ initialContestants }: RankingListProps) {
  const { toast } = useToast()
  const [contestants, setContestants] = useState<Contestant[]>(initialContestants)
  const [playerName, setPlayerName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleReorder = useCallback((newOrder: Contestant[]) => {
    setContestants(newOrder)
  }, [])

  const handleSave = async () => {
    if (!playerName.trim()) {
      toast({ title: "Please enter your name", variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      const rankings = contestants.map((c, index) => ({
        contestantId: c.id,
        position: index + 1,
      }))

      const res = await fetch("/api/rankings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: playerName.trim(),
          rankings,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save")
      }

      setIsSubmitted(true)
      toast({ title: "Predictions submitted and locked!" })
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : "Failed to submit predictions",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setContestants(initialContestants)
  }

  if (isSubmitted) {
    return (
      <Card className="border-accent bg-card">
        <CardContent className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <Save className="h-8 w-8 text-accent" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-card-foreground">
            Predictions Locked In!
          </h3>
          <p className="text-muted-foreground">
            Thank you, {playerName}! Your rankings for all 24 contestants have been submitted and locked for Season 50.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Check the Leaderboard after each elimination to see your score. You
            can also view everyone{"'"}s predictions on the Predictions page.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Player Name Card */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <User className="h-5 w-5 text-primary" />
            Your Name
          </CardTitle>
          <CardDescription>
            Enter your name to submit your Season 50 predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="playerName">Name</Label>
            <Input
              id="playerName"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rankings Card */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-card-foreground">
                Your Predictions
              </CardTitle>
              <CardDescription>
                Drag all 24 contestants into your predicted order. Position 1 =
                Sole Survivor (Winner). Position 24 = First Voted Out.
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              {contestants.length} contestants
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-primary">
              Ready to submit
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                disabled={isSaving}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Order
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !playerName.trim()}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Submit Predictions
              </Button>
            </div>
          </div>

          <Reorder.Group
            axis="y"
            values={contestants}
            onReorder={handleReorder}
            className="space-y-2"
          >
            <AnimatePresence mode="popLayout">
              {contestants.map((contestant, index) => (
                <DraggableContestant
                  key={contestant.id}
                  contestant={contestant}
                  position={index + 1}
                  totalContestants={contestants.length}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>
        </CardContent>
      </Card>
    </div>
  )
}

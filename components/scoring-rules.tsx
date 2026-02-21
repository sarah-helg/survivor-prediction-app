"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, ArrowUpDown, Award } from "lucide-react"

export function ScoringRules() {
  return (
    <Card className="border-primary/30 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
          <Target className="h-5 w-5 text-primary" />
          How Scoring Works
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Points are awarded when a contestant is eliminated based on how close your prediction was to their actual finish.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-lg bg-primary/10 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              5
            </div>
            <div>
              <p className="font-semibold text-card-foreground">Exact Match</p>
              <p className="text-sm text-muted-foreground">
                Predicted the exact position
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-accent/10 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground">
              3
            </div>
            <div>
              <p className="font-semibold text-card-foreground">One Off</p>
              <p className="text-sm text-muted-foreground">
                Within 1 position
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-secondary p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted-foreground text-lg font-bold text-background">
              1
            </div>
            <div>
              <p className="font-semibold text-card-foreground">Two Off</p>
              <p className="text-sm text-muted-foreground">
                Within 2 positions
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <Award className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-card-foreground">
              Final 3 Bonus: +5 Points
            </p>
            <p className="text-sm text-muted-foreground">
              Earn bonus points if you correctly predict someone in the Final 3 (positions 1-3), added on top of position-accuracy points.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-secondary/50 p-3 text-sm">
          <p className="font-medium text-card-foreground">Example:</p>
          <p className="mt-1 text-muted-foreground">
            A contestant finishes at position 15. If you predicted position 14 or 16 (one off), you earn 3 points. Position 13 or 17 (two off) earns 1 point. If they finish in the Final 3 and you predicted them there, you get position points plus a 5-point bonus.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

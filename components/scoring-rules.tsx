"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, ArrowUpDown, Award } from "lucide-react"

export function ScoringRules() {
  return (
    <Card className="border-primary/30 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
          <Target className="h-5 w-5 text-primary" />
          Scoring Rules &mdash; Survivor Season 50
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Rank all 24 contestants before the season premiere. Position 1 = Sole
          Survivor (Winner). Position 24 = First Voted Out. Points are awarded
          each time a contestant is eliminated based on how close your predicted
          position was to their actual finish.
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
                You predicted the exact position they finished
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
                Your prediction was 1 position away from their actual finish
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
                Your prediction was 2 positions away from their actual finish
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
              If you correctly predict any contestant finishing in the Final 3
              (positions 1, 2, or 3), you earn 5 bonus points on top of any
              position-accuracy points.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-3">
          <ArrowUpDown className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-semibold text-card-foreground">
              How Positions Work
            </p>
            <p className="text-sm text-muted-foreground">
              Position 1 = Sole Survivor (Winner). Position 2 = Runner-up.
              Position 3 = 3rd Place. ... Position 24 = First person voted out.
              Drag contestants to reorder your predictions.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-secondary/50 p-3 text-sm">
          <p className="font-medium text-card-foreground">Example:</p>
          <p className="mt-1 text-muted-foreground">
            A contestant is eliminated and finishes at position 15. If you
            predicted them at position 14 or 16 (one off), you earn 3 points. If
            you predicted 13 or 17 (two off), you earn 1 point. If they finish in
            the Final 3 and you had them there, you get your position points plus
            a 5-point bonus.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

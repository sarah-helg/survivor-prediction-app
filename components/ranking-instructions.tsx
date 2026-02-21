import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GripVertical, Trophy, Info, Lock, Eye } from "lucide-react"

export function RankingInstructions() {
  const steps = [
    {
      icon: GripVertical,
      title: "Drag to Reorder",
      description: "Click and drag the handle to move contestants",
    },
    {
      icon: Trophy,
      title: "Rank from Winner to First Out",
      description: "Position 1 = Winner, Position 24 = First Out",
    },
    {
      icon: Lock,
      title: "Locked After Submission",
      description: "Rankings cannot be changed once submitted",
    },
  ]

  return (
    <Card className="sticky top-24 border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Info className="h-5 w-5 text-primary" />
          Quick Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step) => (
          <div key={step.title} className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <step.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-card-foreground">{step.title}</p>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

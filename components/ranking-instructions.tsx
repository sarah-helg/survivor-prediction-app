import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GripVertical, Trophy, Info, Lock, Eye } from "lucide-react"

export function RankingInstructions() {
  const steps = [
    {
      icon: GripVertical,
      title: "Drag to Reorder",
      description: "Click and drag the handle to move contestants up or down",
    },
    {
      icon: Trophy,
      title: "Position 1 = Winner",
      description:
        "Position 1 is the Sole Survivor. Position 24 is the first person voted out.",
    },
    {
      icon: Lock,
      title: "One Submission Only",
      description:
        "Rankings are locked forever once you submit. Choose wisely!",
    },
    {
      icon: Eye,
      title: "View All Predictions",
      description:
        "After submitting, you can view everyone's predictions on the Predictions page.",
    },
  ]

  return (
    <Card className="sticky top-24 border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Info className="h-5 w-5 text-primary" />
          How It Works
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

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm text-card-foreground">
            <strong>Important:</strong> Submit your predictions before the Season
            50 premiere. Once submitted, your rankings are permanently locked.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

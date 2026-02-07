import { Users, Flame, UserCheck, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardsProps {
  stats: {
    totalContestants: number
    remainingContestants: number
    eliminatedContestants: number
    totalUsers: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Contestants",
      value: stats.totalContestants,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Still in Game",
      value: stats.remainingContestants,
      icon: UserCheck,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      title: "Eliminated",
      value: stats.eliminatedContestants,
      icon: Flame,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      title: "Players",
      value: stats.totalUsers,
      icon: Trophy,
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`rounded-lg p-3 ${card.bg}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <p className="text-2xl font-bold text-card-foreground">{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

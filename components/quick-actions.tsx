import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Trophy, Settings, ArrowRight } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Update Rankings",
      description: "Drag and drop to rank contestants by elimination order",
      href: "/rankings",
      icon: BarChart3,
      variant: "default" as const,
    },
    {
      title: "View Leaderboard",
      description: "See how you stack up against other players",
      href: "/leaderboard",
      icon: Trophy,
      variant: "secondary" as const,
    },
    {
      title: "Admin Panel",
      description: "Manage contestants and process eliminations",
      href: "/admin",
      icon: Settings,
      variant: "secondary" as const,
    },
  ]

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="block">
            <Button
              variant={action.variant}
              className="h-auto w-full justify-start gap-4 p-4 text-left"
            >
              <div className="rounded-lg bg-background/20 p-2">
                <action.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{action.title}</p>
                <p className="text-xs opacity-80">{action.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 opacity-60" />
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

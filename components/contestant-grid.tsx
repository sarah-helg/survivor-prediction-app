"use client"

import { useState } from "react"
import { ContestantCard } from "@/components/contestant-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import type { Contestant } from "@/lib/db"

interface ContestantGridProps {
  contestants: Contestant[]
}

export function ContestantGrid({ contestants }: ContestantGridProps) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "eliminated">("all")

  const filteredContestants = contestants.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && c.status === 'active') ||
      (filter === "eliminated" && c.status === 'eliminated')
    return matchesSearch && matchesFilter
  })

  // Group by season instead of tribe
  const seasons = [...new Set(contestants.map((c) => c.season))]

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Contestants</CardTitle>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contestants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "active" ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={filter === "eliminated" ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilter("eliminated")}
            >
              Eliminated
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {seasons.map((season) => {
          const seasonContestants = filteredContestants.filter(
            (c) => c.season === season
          )
          if (seasonContestants.length === 0) return null

          return (
            <div key={season} className="mb-6 last:mb-0">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {season}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {seasonContestants.map((contestant) => (
                  <ContestantCard
                    key={contestant.id}
                    contestant={contestant}
                    size="md"
                  />
                ))}
              </div>
            </div>
          )
        })}

        {filteredContestants.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No contestants found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

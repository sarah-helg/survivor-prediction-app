"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, LogIn } from "lucide-react"
import { AdminPanel } from "@/components/admin-panel"
import type { Contestant } from "@/lib/db"

interface AdminGateProps {
  contestants: Contestant[]
  stats: {
    totalContestants: number
    activeContestants: number
    eliminatedContestants: number
    totalUsers: number
    usersWithRankings: number
  }
}

export function AdminGate({ contestants, stats }: AdminGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === "sarah" && password === "sarahsurvivor") {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Invalid username or password")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-card-foreground">Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the Season 50 admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Season 50 Admin Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage contestants, process eliminations, and update scores
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Contestants</p>
          <p className="text-2xl font-bold text-card-foreground">{stats.totalContestants}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Still Active</p>
          <p className="text-2xl font-bold text-accent">{stats.activeContestants}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Eliminated</p>
          <p className="text-2xl font-bold text-destructive">{stats.eliminatedContestants}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Players</p>
          <p className="text-2xl font-bold text-primary">{stats.usersWithRankings}</p>
        </div>
      </div>

      <AdminPanel contestants={contestants} />
    </div>
  )
}

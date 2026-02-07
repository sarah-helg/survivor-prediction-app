"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Flame, Upload, AlertTriangle, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Contestant } from "@/lib/db"

interface AdminPanelProps {
  contestants: Contestant[]
}

export function AdminPanel({ contestants }: AdminPanelProps) {
  const { toast } = useToast()
  const [selectedContestant, setSelectedContestant] = useState<string>("")
  const [finalRank, setFinalRank] = useState<string>("")
  const [isEliminating, setIsEliminating] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [uploadingFor, setUploadingFor] = useState<number | null>(null)

  const activeContestants = contestants.filter((c) => c.status === 'active')
  const eliminatedContestants = contestants.filter((c) => c.status === 'eliminated')

  const handleEliminate = async () => {
    if (!selectedContestant) return

    setIsEliminating(true)
    try {
      const res = await fetch("/api/admin/eliminate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contestantId: Number.parseInt(selectedContestant),
          finalRank: finalRank ? Number.parseInt(finalRank) : null,
        }),
      })

      if (!res.ok) throw new Error("Failed to eliminate")

      toast({ title: "Contestant eliminated and scores updated!" })
      setConfirmDialogOpen(false)
      setSelectedContestant("")
      setFinalRank("")
      // Refresh the page to show updated data
      window.location.reload()
    } catch {
      toast({ title: "Failed to process elimination", variant: "destructive" })
    } finally {
      setIsEliminating(false)
    }
  }

  const handleImageUpload = async (contestantId: number, file: File) => {
    setUploadingFor(contestantId)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("contestantId", contestantId.toString())

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      toast({ title: "Image uploaded successfully!" })
      window.location.reload()
    } catch {
      toast({ title: "Failed to upload image", variant: "destructive" })
    } finally {
      setUploadingFor(null)
    }
  }

  const selectedContestantData = contestants.find(
    (c) => c.id.toString() === selectedContestant
  )

  return (
    <div className="space-y-6">
      {/* Elimination Section */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Flame className="h-5 w-5 text-destructive" />
            Process Elimination
          </CardTitle>
          <CardDescription>
            Select a contestant to mark as eliminated and calculate scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-card-foreground">
                Contestant
              </label>
              <Select value={selectedContestant} onValueChange={setSelectedContestant}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contestant" />
                </SelectTrigger>
                <SelectContent>
                  {activeContestants.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name} ({c.profession || c.season})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-card-foreground">
                Final Rank (optional)
              </label>
              <p className="mb-2 text-xs text-muted-foreground">
                #1 = Winner, #24 = First eliminated
              </p>
              <Select value={finalRank} onValueChange={setFinalRank}>
                <SelectTrigger>
                  <SelectValue placeholder="Rank" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => i + 1).map((rank) => (
                    <SelectItem key={rank} value={rank.toString()}>
                      #{rank}{rank === 1 ? ' (Winner)' : rank === 24 ? ' (First Out)' : rank <= 3 ? ' (Final 3)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="mt-4 w-full"
                variant="destructive"
                disabled={!selectedContestant}
              >
                <Flame className="mr-2 h-4 w-4" />
                Eliminate Contestant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Confirm Elimination
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to eliminate{" "}
                  <strong>{selectedContestantData?.name}</strong>
                  {finalRank ? ` at rank #${finalRank}` : ""}?
                  This will update all player scores.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => setConfirmDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleEliminate}
                  disabled={isEliminating}
                >
                  {isEliminating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Flame className="mr-2 h-4 w-4" />
                  )}
                  Confirm Elimination
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Contestant Images Section */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Upload className="h-5 w-5 text-primary" />
            Manage Contestant Images
          </CardTitle>
          <CardDescription>
            Upload photos for each contestant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contestants.map((contestant) => (
              <div
                key={contestant.id}
                className={cn(
                  "flex items-center gap-4 rounded-lg p-3 transition-colors",
                  contestant.status === 'eliminated'
                    ? "bg-secondary/30 opacity-60"
                    : "bg-secondary/50 hover:bg-secondary/70"
                )}
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                  {contestant.image_url ? (
                    <img
                      src={contestant.image_url || "/placeholder.svg"}
                      alt={contestant.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-bold text-muted-foreground">
                      {contestant.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium text-card-foreground",
                    contestant.status === 'eliminated' && "line-through"
                  )}>
                    {contestant.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{contestant.profession || contestant.season}</p>
                </div>

                <div className="flex items-center gap-2">
                  {contestant.image_url && (
                    <CheckCircle className="h-4 w-4 text-accent" />
                  )}
                  <label className="cursor-pointer">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(contestant.id, file)
                      }}
                      disabled={uploadingFor === contestant.id}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={uploadingFor === contestant.id}
                      asChild
                    >
                      <span>
                        {uploadingFor === contestant.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Elimination History */}
      {eliminatedContestants.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Elimination History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <AnimatePresence>
                {eliminatedContestants
                  .sort((a, b) => (a.final_rank || 0) - (b.final_rank || 0))
                  .map((contestant) => (
                    <motion.div
                      key={contestant.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 rounded-lg bg-destructive/10 p-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive text-sm font-bold text-destructive-foreground">
                        #{contestant.final_rank || '?'}
                      </div>
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted grayscale">
                        {contestant.image_url ? (
                          <img
                            src={contestant.image_url || "/placeholder.svg"}
                            alt={contestant.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                            {contestant.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground line-through">
                          {contestant.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Rank #{contestant.final_rank || 'N/A'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

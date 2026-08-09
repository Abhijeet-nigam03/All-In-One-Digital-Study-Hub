"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Target, Plus, Pencil, Trash2 } from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  progress: number
  statusText: string
}

const defaultGoals: Goal[] = [
  {
    id: "1",
    title: "Master React & Next.js",
    description: "Complete 3 full-stack projects using modern web technologies.",
    progress: 33,
    statusText: "1 of 3 projects completed"
  }
]

export function WorkspaceGoals() {
  const [goals, setGoals] = React.useState<Goal[]>([])
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  
  // Form state
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [progress, setProgress] = React.useState(0)
  const [statusText, setStatusText] = React.useState("")

  React.useEffect(() => {
    const saved = localStorage.getItem("workspace-goals")
    if (saved) {
      setGoals(JSON.parse(saved))
    } else {
      setGoals(defaultGoals)
      localStorage.setItem("workspace-goals", JSON.stringify(defaultGoals))
    }
  }, [])

  const saveToLocal = (newGoals: Goal[]) => {
    setGoals(newGoals)
    localStorage.setItem("workspace-goals", JSON.stringify(newGoals))
  }

  const handleOpenDialog = (goal?: Goal) => {
    if (goal) {
      setEditingId(goal.id)
      setTitle(goal.title)
      setDescription(goal.description)
      setProgress(goal.progress)
      setStatusText(goal.statusText)
    } else {
      setEditingId(null)
      setTitle("")
      setDescription("")
      setProgress(0)
      setStatusText("")
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!title.trim()) return

    if (editingId) {
      const updated = goals.map(g => 
        g.id === editingId 
          ? { ...g, title, description, progress, statusText }
          : g
      )
      saveToLocal(updated)
    } else {
      const newGoal: Goal = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        progress,
        statusText
      }
      saveToLocal([...goals, newGoal])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    saveToLocal(goals.filter(g => g.id !== id))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="uppercase">LEARNING GOALS</CardTitle>
          <CardDescription>Set and track your long-term objectives.</CardDescription>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button size="sm" onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="uppercase">{editingId ? "EDIT GOAL" : "ADD GOAL"}</DialogTitle>
              <DialogDescription>
                Track a new learning objective or milestone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Goal Title</Label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Master React & Next.js"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="e.g. Complete 3 full-stack projects..."
                />
              </div>
              <div className="space-y-2">
                <Label>Status Text</Label>
                <Input 
                  value={statusText} 
                  onChange={(e) => setStatusText(e.target.value)} 
                  placeholder="e.g. 1 of 3 projects completed"
                />
              </div>
              <div className="space-y-2">
                <Label>Progress (%)</Label>
                <Input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={progress} 
                  onChange={(e) => setProgress(Number(e.target.value))} 
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No goals added yet.</p>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className="group relative flex items-start gap-4">
              <div className="mt-0.5"><Target className="h-5 w-5 text-primary" /></div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium uppercase">{goal.title}</h4>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background/80 px-2 rounded-md">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleOpenDialog(goal)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDelete(goal.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">{goal.description}</p>
                <div className="pt-2">
                  <Progress value={goal.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{goal.statusText}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

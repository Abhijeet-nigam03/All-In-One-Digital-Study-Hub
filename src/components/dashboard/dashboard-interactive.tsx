"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Timer, CheckCircle, BookOpen, PlayCircle, Trash2, Clock } from "lucide-react"
import { FloatingShapes } from "@/components/3d/floating-shapes"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

type ScheduleItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'task' | 'note' | 'lecture' | 'reminder';
  completed?: boolean;
}

export function DashboardInteractive() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    {
      id: "1",
      title: "Physics Lecture",
      description: "2 hours remaining",
      time: "4:00 PM",
      type: "lecture"
    },
    {
      id: "2",
      title: "Mathematics Revision",
      description: "Matrices & Determinants",
      time: "6:30 PM",
      type: "task"
    }
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [actionType, setActionType] = useState<'task' | 'note' | 'lecture' | 'reminder' | null>(null)
  const [formData, setFormData] = useState({ title: "", description: "", time: "" })

  const openModal = (type: 'task' | 'note' | 'lecture' | 'reminder') => {
    setActionType(type)
    setFormData({ title: "", description: "", time: "" })
    setIsOpen(true)
  }

  const handleSave = () => {
    if (!formData.title) return

    const newItem: ScheduleItem = {
      id: Math.random().toString(36).substring(2, 9),
      title: formData.title,
      description: formData.description || "Added just now",
      time: formData.time || "Now",
      type: actionType!
    }

    setScheduleItems(prev => [newItem, ...prev])
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    setScheduleItems(prev => prev.filter(item => item.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckCircle className="h-6 w-6 text-primary" />
      case 'note': return <BookOpen className="h-6 w-6 text-primary" />
      case 'lecture': return <PlayCircle className="h-6 w-6 text-primary" />
      case 'reminder': return <Timer className="h-6 w-6 text-primary" />
      default: return <CheckCircle className="h-6 w-6 text-primary" />
    }
  }

  // Dynamic stats
  const totalTasks = scheduleItems.filter(item => item.type === 'task').length
  const completedTasks = scheduleItems.filter(item => item.type === 'task' && item.completed).length
  const pendingTasks = totalTasks - completedTasks

  const completedLectures = scheduleItems.filter(item => item.type === 'lecture' && item.completed).length

  const [studyHours, setStudyHours] = useState(0)

  useEffect(() => {
    const updateStudyHours = () => {
      const savedSeconds = localStorage.getItem('total_study_seconds')
      if (savedSeconds) {
         setStudyHours(Number((parseInt(savedSeconds) / 3600).toFixed(1)))
      }
    }
    
    updateStudyHours()
    
    // Listen for custom event from the study timer
    window.addEventListener('studyTimeUpdated', updateStudyHours)
    
    return () => {
      window.removeEventListener('studyTimeUpdated', updateStudyHours)
    }
  }, [])
  
  const currentStreak = 7

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-3d bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Hours ⌛</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">{studyHours}h</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              +1.5h from yesterday 📈
            </p>
          </CardContent>
        </Card>
        <Card className="hover-3d bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed ✅</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">{completedTasks}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {pendingTasks} pending task{pendingTasks !== 1 ? 's' : ''} 📝
            </p>
          </CardContent>
        </Card>
        <Card className="hover-3d bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak 🔥</CardTitle>
            <Timer className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">{currentStreak} Days</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Keep it up! 💪
            </p>
          </CardContent>
        </Card>
        <Card className="hover-3d bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lectures 🎬</CardTitle>
            <PlayCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">{completedLectures}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Completed today ✨
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 hover-3d">
          <CardHeader>
            <CardTitle>Today&apos;s Schedule 📅</CardTitle>
            <CardDescription>
              Your upcoming events and tasks for today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {scheduleItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No items scheduled for today. Create one!
                </div>
              ) : (
                scheduleItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 rounded-xl border p-4 bg-background/50 hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm shrink-0">
                      <span className="text-xs font-semibold text-center leading-tight">
                        {item.time.split(' ')[0]}<br />
                        {item.time.split(' ')[1] || ''}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      {(item.type === 'task' || item.type === 'lecture') && (
                        <Checkbox 
                          checked={item.completed} 
                          onCheckedChange={(checked) => {
                            setScheduleItems(prev => prev.map(i => 
                              i.id === item.id ? { ...i, completed: checked === true } : i
                            ))
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-5 w-5 rounded-sm"
                        />
                      )}
                      <div className="flex flex-col min-w-0">
                        <p className={`font-medium flex items-center gap-2 truncate ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.title}
                          <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
                            {item.type}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                      title="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 hover-3d relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[40px] pointer-events-none" />
          <div className="absolute right-0 top-0 w-full h-full opacity-30 pointer-events-none">
             <FloatingShapes />
          </div>
          <CardHeader>
            <CardTitle>Quick Actions ⚡</CardTitle>
            <CardDescription>
              Create new study items quickly.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 relative z-10">
            <button onClick={() => openModal('task')} className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-card/80 backdrop-blur-md p-5 text-card-foreground shadow-sm hover-3d hover:border-primary/50 group cursor-pointer transition-all">
              <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-semibold">Add Task ✍️</span>
            </button>
            <button onClick={() => openModal('note')} className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-card/80 backdrop-blur-md p-5 text-card-foreground shadow-sm hover-3d hover:border-primary/50 group cursor-pointer transition-all">
              <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-semibold">Add Note 📝</span>
            </button>
            <button onClick={() => openModal('lecture')} className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-card/80 backdrop-blur-md p-5 text-card-foreground shadow-sm hover-3d hover:border-primary/50 group cursor-pointer transition-all">
              <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <PlayCircle className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-semibold">Add Lecture 🎬</span>
            </button>
            <button onClick={() => openModal('reminder')} className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-card/80 backdrop-blur-md p-5 text-card-foreground shadow-sm hover-3d hover:border-primary/50 group cursor-pointer transition-all">
              <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Timer className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-semibold">Set Reminder 🔔</span>
            </button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] glass">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType && getIcon(actionType)}
              Add New {actionType ? actionType.charAt(0).toUpperCase() + actionType.slice(1) : 'Item'}
            </DialogTitle>
            <DialogDescription>
              Fill out the details below to add it to your schedule.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder={`E.g., Read Chapter 4...`}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Details / Description</Label>
              <Input
                id="description"
                placeholder="Brief description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                placeholder="E.g., 2:00 PM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save to Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

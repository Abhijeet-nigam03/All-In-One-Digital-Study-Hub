"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Clock, Tag, Trash2, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type StudySession = {
  id: string
  subject: string
  topic: string
  duration: string
  status: "Planned" | "Completed"
  date: string
}

export function StudySessions() {
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    duration: "",
    date: "",
    status: "Planned" as "Planned" | "Completed"
  })

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("studyHub_sessions")
    if (saved) {
      try {
        setSessions(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse sessions", e)
      }
    } else {
      // Default sessions
      setSessions([
        { id: "1", subject: "Physics", topic: "Quantum Mechanics", duration: "45 min", status: "Completed", date: "Today, 10:00 AM" },
        { id: "2", subject: "Mathematics", topic: "Linear Algebra", duration: "1h 20m", status: "Completed", date: "Today, 12:30 PM" },
        { id: "3", subject: "Computer Science", topic: "Data Structures", duration: "2h", status: "Planned", date: "Tomorrow, 2:00 PM" },
      ])
    }
  }, [])

  // Save to local storage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("studyHub_sessions", JSON.stringify(sessions))
    }
  }, [sessions])

  const handleAddSession = () => {
    if (!formData.subject || !formData.topic) return
    
    const newSession: StudySession = {
      id: Date.now().toString(),
      ...formData
    }
    
    setSessions([newSession, ...sessions])
    setIsOpen(false)
    setFormData({ subject: "", topic: "", duration: "", date: "", status: "Planned" })
  }

  const handleDelete = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id))
  }

  const toggleStatus = (id: string) => {
    setSessions(sessions.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === "Planned" ? "Completed" : "Planned" }
      }
      return s
    }))
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Study Sessions</CardTitle>
          <CardDescription>Track your past and planned study activities.</CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button size="sm" className="shrink-0" onClick={() => setIsOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add Session</span>
              <span className="sm:hidden">Add</span>
            </Button>
          <DialogContent className="sm:max-w-[425px] glass">
            <DialogHeader>
              <DialogTitle>Add Study Session</DialogTitle>
              <DialogDescription>
                Plan a new study session or log a past one.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g. Physics"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g. Quantum Mechanics"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g. 45 min"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date & Time</Label>
                  <Input
                    id="date"
                    placeholder="e.g. Today, 10:00 AM"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => {
                    if (value) setFormData({ ...formData, status: value as "Planned" | "Completed" })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSession}>Save Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No study sessions recorded yet.
            </div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="group flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-sm">{session.subject}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full mt-1 w-fit ${session.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'}`}>
                      {session.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/50"
                      onClick={() => toggleStatus(session.id)}
                      title={session.status === "Planned" ? "Mark Completed" : "Mark Planned"}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50"
                      onClick={() => handleDelete(session.id)}
                      title="Delete Session"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{session.topic}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {session.duration || "N/A"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {session.date || "N/A"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

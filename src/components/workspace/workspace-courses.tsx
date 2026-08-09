"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react"

interface Course {
  id: string
  name: string
  progress: number
}

const defaultCourses: Course[] = [
  {
    id: "1",
    name: "Data Structures and Algorithms",
    progress: 75
  },
  {
    id: "2",
    name: "Database Management Systems",
    progress: 40
  }
]

export function WorkspaceCourses() {
  const [courses, setCourses] = React.useState<Course[]>([])
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  
  // Form state
  const [name, setName] = React.useState("")
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const saved = localStorage.getItem("workspace-courses")
    if (saved) {
      setCourses(JSON.parse(saved))
    } else {
      setCourses(defaultCourses)
      localStorage.setItem("workspace-courses", JSON.stringify(defaultCourses))
    }
  }, [])

  const saveToLocal = (newCourses: Course[]) => {
    setCourses(newCourses)
    localStorage.setItem("workspace-courses", JSON.stringify(newCourses))
  }

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingId(course.id)
      setName(course.name)
      setProgress(course.progress)
    } else {
      setEditingId(null)
      setName("")
      setProgress(0)
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!name.trim()) return

    if (editingId) {
      const updated = courses.map(c => 
        c.id === editingId 
          ? { ...c, name, progress }
          : c
      )
      saveToLocal(updated)
    } else {
      const newCourse: Course = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        progress
      }
      saveToLocal([...courses, newCourse])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    saveToLocal(courses.filter(c => c.id !== id))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="uppercase">ENROLLED COURSES</CardTitle>
          <CardDescription>Your current semester courses and progress.</CardDescription>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button size="sm" onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="uppercase">{editingId ? "EDIT COURSE" : "ADD COURSE"}</DialogTitle>
              <DialogDescription>
                Track a new enrolled course.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Course Name</Label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Machine Learning"
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
        {courses.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No courses added yet.</p>
        ) : (
          courses.map(course => (
            <div key={course.id} className="space-y-2 group relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="font-medium uppercase">{course.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground">{course.progress}%</span>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background/80 px-2 rounded-md">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleOpenDialog(course)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDelete(course.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Plus, Pencil, Trash2, X, Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Skill = {
  id: string;
  subject: string;
  level: string; // e.g., "Level 4" or "Unit 2"
  description: string; // e.g., "Intermediate"
  progress: number;
  tags: string[];
}

export function WorkspaceSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    subject: "",
    level: "",
    description: "",
    progress: 0,
    tagsString: ""
  })

  useEffect(() => {
    const saved = localStorage.getItem("studyHub_skills")
    if (saved) {
      try {
        setSkills(JSON.parse(saved))
      } catch(e) {
        console.error("Failed to parse skills", e)
      }
    } else {
      setSkills([
        {
          id: "1",
          subject: "Programming",
          level: "Level 4",
          description: "Intermediate",
          progress: 65,
          tags: ["Python", "JavaScript", "C++"]
        },
        {
          id: "2",
          subject: "Mathematics",
          level: "Level 6",
          description: "Advanced",
          progress: 80,
          tags: ["Calculus", "Linear Algebra"]
        }
      ])
    }
  }, [])

  useEffect(() => {
    if (skills.length > 0) {
      localStorage.setItem("studyHub_skills", JSON.stringify(skills))
    }
  }, [skills])

  const openAddDialog = () => {
    setEditingId(null)
    setFormData({ subject: "", level: "", description: "", progress: 0, tagsString: "" })
    setIsOpen(true)
  }

  const openEditDialog = (skill: Skill) => {
    setEditingId(skill.id)
    setFormData({
      subject: skill.subject,
      level: skill.level,
      description: skill.description,
      progress: skill.progress,
      tagsString: skill.tags.join(", ")
    })
    setIsOpen(true)
  }

  const handleSave = () => {
    if (!formData.subject) return

    const tagsArray = formData.tagsString.split(",").map(t => t.trim()).filter(t => t !== "")

    if (editingId) {
      setSkills(skills.map(s => s.id === editingId ? {
        ...s,
        subject: formData.subject,
        level: formData.level,
        description: formData.description,
        progress: Number(formData.progress),
        tags: tagsArray
      } : s))
    } else {
      const newSkill: Skill = {
        id: Date.now().toString(),
        subject: formData.subject,
        level: formData.level || "Level 1",
        description: formData.description || "Beginner",
        progress: Number(formData.progress) || 0,
        tags: tagsArray
      }
      setSkills([...skills, newSkill])
    }
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    const updated = skills.filter(s => s.id !== id)
    setSkills(updated)
    if (updated.length === 0) {
       localStorage.removeItem("studyHub_skills")
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {skills.map(skill => (
        <Card key={skill.id} className="relative group hover:border-primary/50 transition-colors hover:shadow-md flex flex-col">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur" onClick={() => openEditDialog(skill)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur text-red-500 hover:text-red-600" onClick={() => handleDelete(skill.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase">{skill.subject}</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-2xl font-bold">{skill.level}</div>
            <p className="text-xs text-muted-foreground mb-4">{skill.description}</p>
            <Progress value={skill.progress} className="h-2" />
            <div className="mt-4 flex flex-wrap gap-2">
              {skill.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Card 
            className="border-dashed border-2 bg-muted/20 flex flex-col items-center justify-center min-h-[220px] cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all group"
            onClick={openAddDialog}
          >
            <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
              <Plus className="h-10 w-10 mb-2" />
              <p className="font-semibold text-lg uppercase">ADD NEW SKILL</p>
            </div>
          </Card>
        <DialogContent className="sm:max-w-[425px] glass">
          <DialogHeader>
            <DialogTitle className="uppercase">{editingId ? "EDIT SKILL" : "ADD NEW SKILL"}</DialogTitle>
            <DialogDescription>
              Track a new subject, skill level, or unit.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject Name</Label>
              <Input
                id="subject"
                placeholder="e.g. Mathematics"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="level">Level / Unit</Label>
                <Input
                  id="level"
                  placeholder="e.g. Level 4"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="e.g. Intermediate"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="e.g. Calculus, Algebra"
                value={formData.tagsString}
                onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

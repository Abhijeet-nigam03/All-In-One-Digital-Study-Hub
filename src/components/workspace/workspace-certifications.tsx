"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Award, Plus, Pencil, Trash2 } from "lucide-react"

interface Certification {
  id: string
  title: string
  issuer: string
  dateCompleted: string
}

const defaultCertifications: Certification[] = [
  {
    id: "1",
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    dateCompleted: "Aug 2023"
  }
]

export function WorkspaceCertifications() {
  const [certs, setCerts] = React.useState<Certification[]>([])
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  
  // Form state
  const [title, setTitle] = React.useState("")
  const [issuer, setIssuer] = React.useState("")
  const [dateCompleted, setDateCompleted] = React.useState("")

  React.useEffect(() => {
    const saved = localStorage.getItem("workspace-certs")
    if (saved) {
      setCerts(JSON.parse(saved))
    } else {
      setCerts(defaultCertifications)
      localStorage.setItem("workspace-certs", JSON.stringify(defaultCertifications))
    }
  }, [])

  const saveToLocal = (newCerts: Certification[]) => {
    setCerts(newCerts)
    localStorage.setItem("workspace-certs", JSON.stringify(newCerts))
  }

  const handleOpenDialog = (cert?: Certification) => {
    if (cert) {
      setEditingId(cert.id)
      setTitle(cert.title)
      setIssuer(cert.issuer)
      setDateCompleted(cert.dateCompleted)
    } else {
      setEditingId(null)
      setTitle("")
      setIssuer("")
      setDateCompleted("")
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!title.trim() || !issuer.trim()) return

    if (editingId) {
      const updated = certs.map(c => 
        c.id === editingId 
          ? { ...c, title, issuer, dateCompleted }
          : c
      )
      saveToLocal(updated)
    } else {
      const newCert: Certification = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        issuer,
        dateCompleted
      }
      saveToLocal([...certs, newCert])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    saveToLocal(certs.filter(c => c.id !== id))
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {certs.map(cert => (
          <Card key={cert.id} className="group relative">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(cert)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(cert.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="uppercase pr-16">{cert.title}</CardTitle>
                <CardDescription>Issued by {cert.issuer}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Completed: {cert.dateCompleted}</p>
            </CardContent>
          </Card>
        ))}

          <Card onClick={() => handleOpenDialog()} className="border-dashed border-2 bg-muted/50 flex flex-col items-center justify-center min-h-[150px] cursor-pointer hover:bg-muted transition-colors">
            <div className="flex flex-col items-center text-muted-foreground">
              <Award className="h-8 w-8 mb-2" />
              <p className="font-medium uppercase">ADD CERTIFICATION</p>
            </div>
          </Card>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="uppercase">{editingId ? "EDIT CERTIFICATION" : "ADD CERTIFICATION"}</DialogTitle>
            <DialogDescription>
              Add a certification or credential you've earned.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Certification Title</Label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. AWS Cloud Practitioner"
              />
            </div>
            <div className="space-y-2">
              <Label>Issuer</Label>
              <Input 
                value={issuer} 
                onChange={(e) => setIssuer(e.target.value)} 
                placeholder="e.g. Amazon Web Services"
              />
            </div>
            <div className="space-y-2">
              <Label>Date Completed</Label>
              <Input 
                value={dateCompleted} 
                onChange={(e) => setDateCompleted(e.target.value)} 
                placeholder="e.g. Aug 2023"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

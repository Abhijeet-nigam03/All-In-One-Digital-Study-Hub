"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SettingsPage() {
  const [firstName, setFirstName] = React.useState("John")
  const [lastName, setLastName] = React.useState("Doe")
  const [email, setEmail] = React.useState("student@university.edu")
  const [avatar, setAvatar] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [university, setUniversity] = React.useState("Tech University")
  const [major, setMajor] = React.useState("Computer Science")
  const [year, setYear] = React.useState("3rd Year")
  
  const [isSaving, setIsSaving] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const saved = localStorage.getItem("workspace-settings")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.firstName) setFirstName(data.firstName)
        if (data.lastName) setLastName(data.lastName)
        if (data.email) setEmail(data.email)
        if (data.avatar) setAvatar(data.avatar)
        if (data.bio) setBio(data.bio)
        if (data.university) setUniversity(data.university)
        if (data.major) setMajor(data.major)
        if (data.year) setYear(data.year)
      } catch (e) {
        console.error("Error parsing settings", e)
      }
    }
  }, [])

  const handleSave = () => {
    setIsSaving(true)
    
    const data = {
      firstName,
      lastName,
      email,
      avatar,
      bio,
      university,
      major,
      year
    }
    
    localStorage.setItem("workspace-settings", JSON.stringify(data))
    
    setTimeout(() => {
      setIsSaving(false)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    }, 500)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your public profile and student details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatar} className="object-cover" />
              <AvatarFallback className="text-xl">{firstName.charAt(0) || "J"}{lastName.charAt(0) || "D"}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
              />
              <Button size="sm" onClick={() => fileInputRef.current?.click()}>Change Avatar</Button>
              <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <p className="text-xs text-muted-foreground">Your primary contact email address.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              placeholder="Tell us a little bit about yourself" 
              className="resize-none" 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Details</CardTitle>
          <CardDescription>Information about your studies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="university">University / College</Label>
            <Input id="university" value={university} onChange={(e) => setUniversity(e.target.value)} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="major">Major / Course</Label>
              <Input id="major" value={major} onChange={(e) => setMajor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year of Study</Label>
              <Input id="year" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
          </div>
          
          <Button onClick={handleSave} disabled={isSaving || isSaved}>
            {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Trophy, Target, Award } from "lucide-react"
import { WorkspaceSkills } from "@/components/workspace/workspace-skills"
import { WorkspaceCourses } from "@/components/workspace/workspace-courses"
import { WorkspaceCertifications } from "@/components/workspace/workspace-certifications"
import { WorkspaceGoals } from "@/components/workspace/workspace-goals"

export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight uppercase">PERSONAL WORKSPACE</h1>
        <p className="text-muted-foreground">
          Track your skills, courses, certifications, and overall progress.
        </p>
      </div>

      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="skills" className="uppercase">SKILLS/SUBJECTS</TabsTrigger>
          <TabsTrigger value="courses" className="uppercase">COURSES</TabsTrigger>
          <TabsTrigger value="certifications" className="uppercase">CERTIFICATIONS</TabsTrigger>
          <TabsTrigger value="goals" className="uppercase">GOALS</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="mt-6 space-y-4">
          <WorkspaceSkills />
        </TabsContent>

        <TabsContent value="courses" className="mt-6 space-y-4">
          <WorkspaceCourses />
        </TabsContent>

        <TabsContent value="certifications" className="mt-6 space-y-4">
          <WorkspaceCertifications />
        </TabsContent>

        <TabsContent value="goals" className="mt-6 space-y-4">
          <WorkspaceGoals />
        </TabsContent>

      </Tabs>
    </div>
  )
}

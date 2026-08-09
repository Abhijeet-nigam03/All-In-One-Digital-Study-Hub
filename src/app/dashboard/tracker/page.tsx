import { StudyTimer } from "@/components/tracker/study-timer"
import { StudySessions } from "@/components/tracker/study-sessions"
import { StudyStatistics } from "@/components/tracker/study-statistics"

export const metadata = {
  title: "Study Tracker | Digital Study Hub",
  description: "Track your study sessions and stay focused.",
}

export default function TrackerPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Study Tracker</h1>
        <p className="text-muted-foreground">
          Manage your study time and keep track of your sessions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_400px]">
        <div className="flex flex-col gap-6">
          <StudyTimer />
          <StudyStatistics />
        </div>

        <div>
          <StudySessions />
        </div>
      </div>
    </div>
  )
}

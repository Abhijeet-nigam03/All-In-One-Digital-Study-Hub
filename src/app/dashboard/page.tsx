import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import { DashboardInteractive } from "@/components/dashboard/dashboard-interactive"
import { DynamicGreeting } from "@/components/dashboard/dynamic-greeting"
import { cookies } from "next/headers"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const guestName = cookieStore.get('guest_name')?.value
  const isGuest = Boolean(guestName)

  let user = null
  if (!isGuest) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch (err) {
      console.error("DashboardPage auth error:", err)
    }
  }
  
  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || guestName || 'Student'

  // In a real app, we would fetch this data from Supabase
  const today = new Date()
  const currentStreak = 7
  const studyHours = 4.5
  const completedTasks = 3

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <DynamicGreeting name={displayName} />

        <p className="text-muted-foreground">
          {format(today, "EEEE, MMMM d")} • Let&apos;s make today productive.
        </p>
      </div>



      <DashboardInteractive />
    </div>
  )
}

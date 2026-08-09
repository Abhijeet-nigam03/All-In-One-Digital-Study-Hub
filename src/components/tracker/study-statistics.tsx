"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Clock } from "lucide-react"

export function StudyStatistics() {
  const [todayHours, setTodayHours] = useState(0)

  useEffect(() => {
    const updateStudyHours = () => {
      const savedSeconds = localStorage.getItem('total_study_seconds')
      if (savedSeconds) {
         setTodayHours(Number((parseInt(savedSeconds) / 3600).toFixed(1)))
      }
    }
    
    updateStudyHours()
    window.addEventListener('studyTimeUpdated', updateStudyHours)
    return () => window.removeEventListener('studyTimeUpdated', updateStudyHours)
  }, [])

  // Mock data for the current week, but today is dynamic
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'short' })
  
  const weeklyData = [
    { day: "Mon", hours: currentDay === "Mon" ? todayHours : 2.5, completedTasks: 4 },
    { day: "Tue", hours: currentDay === "Tue" ? todayHours : 4.0, completedTasks: 7 },
    { day: "Wed", hours: currentDay === "Wed" ? todayHours : 3.5, completedTasks: 5 },
    { day: "Thu", hours: currentDay === "Thu" ? todayHours : 1.5, completedTasks: 2 },
    { day: "Fri", hours: currentDay === "Fri" ? todayHours : 5.0, completedTasks: 8 },
    { day: "Sat", hours: currentDay === "Sat" ? todayHours : 6.5, completedTasks: 10 },
    { day: "Sun", hours: currentDay === "Sun" ? todayHours : 0, completedTasks: 0 },
  ]

  const maxHours = Math.max(...weeklyData.map(d => d.hours))
  const totalHours = weeklyData.reduce((sum, d) => sum + d.hours, 0)
  const mostProductiveDay = weeklyData.reduce((prev, current) => (prev.hours > current.hours) ? prev : current).day

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover-3d bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Study Hours</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              {totalHours.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              This week
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover-3d bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Productive Day</CardTitle>
            <BarChart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              {mostProductiveDay}
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Keep the momentum going
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart className="w-5 h-5 text-primary" /> 
            Weekly Activity
          </CardTitle>
          <CardDescription>
            Your study hours across the week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="h-[200px] w-full flex items-end justify-between gap-2 pt-4 relative border-b border-border/50 pb-2">
              {/* Y-axis labels (rough approximation) */}
              <div className="absolute left-0 top-0 bottom-2 flex flex-col justify-between text-[10px] text-muted-foreground pointer-events-none">
                <span>{Math.ceil(maxHours)}h</span>
                <span>{Math.ceil(maxHours / 2)}h</span>
                <span>0h</span>
              </div>
              
              {/* Empty spacer for the y-axis labels */}
              <div className="w-4 shrink-0" />

              {/* Bars */}
              {weeklyData.map((data, index) => {
                const heightPercentage = maxHours === 0 ? 0 : (data.hours / maxHours) * 100
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1 gap-2 group">
                    <div className="w-full flex-1 flex items-end justify-center relative">
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-foreground text-background text-xs py-1 px-2 rounded transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        {data.hours} hrs
                      </div>
                      
                      {/* Bar */}
                      <div 
                        className="w-full max-w-[40px] bg-primary/20 group-hover:bg-primary/40 rounded-t-sm transition-all duration-300 ease-out border-t-2 border-primary"
                        style={{ height: `${Math.max(heightPercentage, 2)}%` }} // Minimum height so 0 isn't completely invisible if we wanted, but 0 is fine
                      >
                         <div 
                           className="w-full bg-primary rounded-t-sm transition-all duration-300"
                           style={{ height: '100%', opacity: 0.8 }}
                         />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {data.day}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

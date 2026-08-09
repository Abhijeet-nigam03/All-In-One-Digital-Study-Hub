"use client"

import * as React from "react"
import { Play, Pause, Square, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function StudyTimer() {
  const [timeLeft, setTimeLeft] = React.useState(25 * 60)
  const [isActive, setIsActive] = React.useState(false)
  const [mode, setMode] = React.useState<"pomodoro" | "shortBreak" | "longBreak" | "custom">("pomodoro")

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
        
        // Track real study time in local storage (only for actual study modes, not breaks)
        if (mode === "pomodoro" || mode === "custom") {
          const currentTotal = parseInt(localStorage.getItem('total_study_seconds') || '0')
          localStorage.setItem('total_study_seconds', (currentTotal + 1).toString())
          // Dispatch event to update dashboard in real-time
          window.dispatchEvent(new Event('studyTimeUpdated'))
        }
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      // Play a sound or show notification in a real app
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, mode])

  const toggleTimer = () => setIsActive(!isActive)
  const stopTimer = () => {
    setIsActive(false)
    resetTimer()
  }

  const resetTimer = () => {
    setIsActive(false)
    if (mode === "pomodoro") setTimeLeft(25 * 60)
    else if (mode === "shortBreak") setTimeLeft(5 * 60)
    else if (mode === "longBreak") setTimeLeft(15 * 60)
    else setTimeLeft(60 * 60) // Custom 1h
  }

  const handleModeChange = (newMode: string) => {
    setMode(newMode as any)
    setIsActive(false)
    if (newMode === "pomodoro") setTimeLeft(25 * 60)
    else if (newMode === "shortBreak") setTimeLeft(5 * 60)
    else if (newMode === "longBreak") setTimeLeft(15 * 60)
    else setTimeLeft(60 * 60) // Custom
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Study Timer</CardTitle>
        <CardDescription>Stay focused with Pomodoro or custom timers.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-8">
        <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger 
              value="pomodoro" 
              title="The Pomodoro Technique is a time management method based on 25-minute stretches of focused work broken by short 5-minute breaks."
            >
              Pomodoro
            </TabsTrigger>
            <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
            <TabsTrigger value="longBreak">Long Break</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="text-8xl font-bold tracking-tighter tabular-nums text-primary">
          {formatTime(timeLeft)}
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-full"
            onClick={toggleTimer}
          >
            {isActive ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 translate-x-[1px]" />
            )}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-full"
            onClick={stopTimer}
          >
            <Square className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-full"
            onClick={resetTimer}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

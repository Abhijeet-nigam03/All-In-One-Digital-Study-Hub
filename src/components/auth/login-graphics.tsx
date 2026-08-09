"use client"

import { motion } from "framer-motion"
import { BookOpen, Timer, MonitorPlay, Briefcase, FileText } from "lucide-react"
import { FloatingShapes } from "@/components/3d/floating-shapes"
import { Logo } from "@/components/ui/logo"

const features = [
  { icon: Timer, text: "Focus Timer & Tracker" },
  { icon: FileText, text: "Rich Text Digital Notes" },
  { icon: BookOpen, text: "PDF Library & Reader" },
  { icon: MonitorPlay, text: "Distraction-Free YouTube" },
  { icon: Briefcase, text: "Skills & Goals Workspace" },
]

export function LoginGraphics() {
  return (
    <div className="relative hidden h-full flex-col bg-neutral-950 p-10 text-white dark:border-r lg:flex overflow-hidden">
      <div className="absolute inset-0 bg-neutral-950" />
      <FloatingShapes />
      {/* Background gradients */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-yellow-500/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-red-500/20 blur-[80px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="relative z-20 flex items-center font-medium">
        <Logo className="h-10 w-auto -ml-2" />
      </div>

      <div className="relative z-20 mt-auto flex flex-col gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
            Your personal digital <br/>
            operating system for <span className="text-primary">learning</span>.
          </h1>
          <p className="text-zinc-400 text-lg max-w-md">
            Eliminate context switching. Bring your PDFs, notes, YouTube lectures, and study tracking into a single, beautifully designed workspace.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 mt-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm p-4 rounded-xl w-max"
            >
              <feature.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-zinc-200">{feature.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

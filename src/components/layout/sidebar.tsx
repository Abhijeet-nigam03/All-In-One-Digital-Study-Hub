"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  MonitorPlay,
  Timer,
  Calendar,
  BarChart,
  Brain,
  GraduationCap,
  Award,
  Rocket,
  Target,
  Briefcase,
  User,
  Settings
} from "lucide-react"

const sidebarItems = [
  {
    title: "DASHBOARD",
    items: [
      { name: "Dashboard 🏠", href: "/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "STUDY",
    items: [
      { name: "Notes 📝", href: "/dashboard/notes", icon: FileText },
      { name: "PDF Library 📚", href: "/dashboard/library", icon: BookOpen },
      { name: "YouTube Study 📺", href: "/dashboard/youtube", icon: MonitorPlay },
      { name: "Focus Workspace 🎯", href: "/dashboard/focus", icon: Target },
      { name: "Study Tracker ⏱️", href: "/dashboard/tracker", icon: Timer },
    ]
  },
  {
    title: "WORKSPACE",
    items: [
      { name: "My Workspace 💼", href: "/dashboard/workspace", icon: Briefcase },
    ]
  },
  {
    title: "ACCOUNT",
    items: [
      { name: "Settings ⚙️", href: "/dashboard/settings", icon: Settings },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" prefetch={true} className="flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
          <Logo className="h-8 w-auto -ml-1 mt-1" />
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {sidebarItems.map((group, i) => (
            <div key={i} className="mb-4">
              <h4 className="mb-1 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h4>
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      isActive ? "bg-muted text-primary" : ""
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}

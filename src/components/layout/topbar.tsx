"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Bell, Search, UserCircle, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { logout } from "@/app/auth/actions"
import { Sidebar } from "@/components/layout/sidebar"
import { FullscreenToggle } from "@/components/ui/fullscreen-toggle"

export function Topbar() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/youtube?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="flex h-14 items-center gap-2 sm:gap-4 border-b glass px-2 sm:px-4 lg:h-[60px] lg:px-6 sticky top-0 z-50">
      <Sheet>
        <SheetTrigger className={buttonVariants({ variant: "outline", size: "icon", className: "shrink-0 lg:hidden" })}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form onSubmit={handleSearch}>
          <div className="relative group">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Search notes, YouTube..."
              className="w-full appearance-none bg-background/50 backdrop-blur-sm pl-8 shadow-sm transition-all duration-300 focus:bg-background md:w-[200px] lg:w-[300px] focus:md:w-[300px] focus:lg:w-[400px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
      <ModeToggle />
      <FullscreenToggle />
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "outline", size: "icon", className: "h-10 w-10 shrink-0 relative hover:bg-muted/50 transition-colors" })}>
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="sr-only">Toggle notifications</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[300px] sm:w-[350px]">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <div className="flex flex-col gap-2 p-2 max-h-[350px] overflow-y-auto">
            <div className="flex flex-col gap-1 rounded-md p-2 hover:bg-accent cursor-pointer transition-colors">
              <span className="text-sm font-medium">Study Session Completed 🎯</span>
              <span className="text-xs text-muted-foreground">You completed a 2 hour focus session! Keep it up.</span>
            </div>
            <div className="flex flex-col gap-1 rounded-md p-2 hover:bg-accent cursor-pointer transition-colors">
              <span className="text-sm font-medium">New Lecture Recommended 📺</span>
              <span className="text-xs text-muted-foreground">We found a new MIT Calculus lecture based on your notes.</span>
            </div>
            <div className="flex flex-col gap-1 rounded-md p-2 hover:bg-accent cursor-pointer transition-colors">
              <span className="text-sm font-medium">AI Notes Ready ✨</span>
              <span className="text-xs text-muted-foreground">Your notes from yesterday have been successfully summarized by AI.</span>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-full" })}>
          <UserCircle className="h-6 w-6" />
          <span className="sr-only">Toggle user menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

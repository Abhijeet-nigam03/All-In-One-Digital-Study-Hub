import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { FloatingShapes } from "@/components/3d/floating-shapes"
import { AIChatWidget } from "@/components/chat/ai-chat-widget"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isGuest = cookieStore.has('guest_name')

  let user = null
  if (!isGuest) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch (err) {
      console.error("DashboardLayout auth error:", err)
    }
  }

  if (!user && !isGuest) {
    redirect('/login')
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[256px_1fr] relative overflow-hidden bg-background">
      {/* 3D Background Gradients & Shapes */}
      <div className="absolute top-0 left-[-20%] w-[50%] h-[50%] rounded-full bg-fuchsia-500/20 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/20 blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-red-500/20 blur-[80px] -z-10 pointer-events-none" />
      
      {/* 3D Floating Shapes background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <FloatingShapes />
      </div>
      
      <div className="hidden lg:block z-10 glass border-r">
        <Sidebar />
      </div>
      <div className="flex flex-col z-10 relative">
        <Topbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>

      <AIChatWidget />
    </div>
  )
}

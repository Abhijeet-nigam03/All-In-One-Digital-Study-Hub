"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowRight, BrainCircuit, ShieldCheck, Zap, BookOpen, PlayCircle, LayoutDashboard, Target, BookMarked, FileText } from "lucide-react"
import { useRef } from "react"
import { Hero3D } from "@/components/3d/hero-3d"
import { Logo } from "@/components/ui/logo"
import { FullscreenToggle } from "@/components/ui/fullscreen-toggle"

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"]
  })


  // Hero Parallax
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "50%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <div ref={containerRef} className="relative bg-neutral-950 text-white min-h-screen selection:bg-blue-500/30">
      {/* Sticky Navbar */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-neutral-950/50 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
          <Logo className="h-10 w-auto" />
        </Link>
        <div className="flex gap-4 items-center">
          <FullscreenToggle variant="ghost" className="text-white hover:text-white/80 hover:bg-white/10" />
          <Link href="/login" className="text-sm font-medium hover:text-blue-400 transition-colors">
            Login
          </Link>
          <Link 
            href="/login" 
            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
          >
            Get Started 🚀
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="h-screen flex flex-col items-center justify-center text-center px-4 relative z-10">
        <Hero3D />
        
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm font-medium mb-8 relative z-10 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Ease Update v0.1 ✨
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] max-w-5xl relative z-10 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]"
        >
          All in one digital 🌐<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-blue-600 drop-shadow-sm">Study-Hub</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-8 text-lg md:text-xl text-neutral-300 max-w-xl font-medium relative z-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
        >
          Gain clarity and harness the power of your study habits with Study Hub. Our intuitive dashboard provides real-time analytics.
        </motion.p>
        </motion.div>
      </div>

      {/* Marquee Section */}
      <div className="relative py-8 bg-[#050B14] overflow-hidden flex whitespace-nowrap z-20 border-y border-white/5">
        {/* Left/Right Fade gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050B14] to-transparent z-30" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050B14] to-transparent z-30" />

        <motion.div 
          animate={{ x: [0, -2000] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          className="flex text-lg md:text-xl font-medium tracking-wide text-white/90"
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-3">
              <div className="flex items-center gap-3 bg-[#131B2F] px-8 py-4 rounded-xl shadow-lg border border-white/5 transition-colors hover:bg-[#1A2540]">
                <FileText className="h-7 w-7 text-yellow-500" /> 
                <span>Notes 📝</span>
              </div>
              <div className="flex items-center gap-3 bg-[#131B2F] px-8 py-4 rounded-xl shadow-lg border border-white/5 transition-colors hover:bg-[#1A2540]">
                <BookOpen className="h-7 w-7 text-red-500" /> 
                <span>PDF Library 📚</span>
              </div>
              <div className="flex items-center gap-3 bg-[#131B2F] px-8 py-4 rounded-xl shadow-lg border border-white/5 transition-colors hover:bg-[#1A2540]">
                <PlayCircle className="h-7 w-7 text-blue-500" /> 
                <span>YouTube Study 📺</span>
              </div>
              <div className="flex items-center gap-3 bg-[#131B2F] px-8 py-4 rounded-xl shadow-lg border border-white/5 transition-colors hover:bg-[#1A2540]">
                <Target className="h-7 w-7 text-yellow-500" /> 
                <span>Focus Workspace 🎯</span>
              </div>
              <div className="flex items-center gap-3 bg-[#131B2F] px-8 py-4 rounded-xl shadow-lg border border-white/5 transition-colors hover:bg-[#1A2540]">
                <LayoutDashboard className="h-7 w-7 text-red-500" /> 
                <span>Study Tracker ⏱️</span>
              </div>
              <div className="flex items-center gap-3 bg-[#131B2F] px-8 py-4 rounded-xl shadow-lg border border-white/5 transition-colors hover:bg-[#1A2540]">
                <BookMarked className="h-7 w-7 text-blue-500" /> 
                <span>Workspace 💼</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Features Scroll Section */}
      <div className="relative z-10 bg-[#050505] pt-32 pb-48 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Powerful Features ⚡</h2>
            <p className="text-xl text-neutral-400 max-w-2xl">Explore the frontier of learning evolution. Our tools redefine the boundaries of what's possible. 🧠</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              delay={0}
              icon={BrainCircuit}
              title="AI Sessions"
              description="Interactive AI that tests your knowledge and generates flashcards on the fly."
            />
            <FeatureCard 
              delay={0.1}
              icon={Zap}
              title="Focus Mode"
              description="Block out distractions with our Pomodoro timer and deep-work ambiance."
              tooltipText="The Pomodoro Technique is a time management method based on 25-minute stretches of focused work broken by short 5-minute breaks."
              tooltipKeyword="Pomodoro"
            />
            <FeatureCard 
              delay={0.2}
              icon={ShieldCheck}
              title="Progress Tracking"
              description="Visually see your streaks, hours studied, and tasks completed in one dashboard."
            />
          </div>
        </div>
      </div>

      {/* Large Image/Callout Section */}
      <div className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] z-10" />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, margin: "-20%" }}
          className="absolute w-[80vw] h-[60vh] bg-blue-900/20 rounded-[3rem] border border-blue-500/20 shadow-[0_0_100px_rgba(59,130,246,0.15)] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
          <h2 className="relative z-20 text-4xl sm:text-5xl md:text-7xl font-black text-center max-w-3xl leading-tight">
            MASTER YOUR <br/> POTENTIAL
          </h2>
        </motion.div>
      </div>

      {/* App Glimpse Section */}
      <div className="relative bg-[#02050D] py-24 sm:py-32 overflow-hidden border-t border-white/5 z-20">
        <div className="max-w-7xl mx-auto px-6 mb-12 sm:mb-16 text-center">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white"
           >
             A Glimpse Inside
           </motion.h2>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-xl text-neutral-400 max-w-2xl mx-auto"
           >
             Experience a beautifully crafted workspace designed for ultimate focus and productivity.
           </motion.p>
        </div>

        {/* CSS-only hide scrollbar */}
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        <div className="relative w-full flex overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar">
           <div className="flex gap-6 sm:gap-8 px-6 sm:px-[15vw] min-w-max">
             {/* Slide 1: Main Dashboard */}
             <motion.div 
               whileHover={{ scale: 1.02, y: -5 }}
               transition={{ type: "spring", stiffness: 400, damping: 30 }}
               className="w-[85vw] sm:w-[70vw] max-w-4xl h-[400px] sm:h-[500px] rounded-3xl border border-white/10 bg-[#0a0a0a] p-4 sm:p-8 shrink-0 snap-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group flex flex-col"
             >
               {/* Mock UI Header */}
               <div className="flex justify-between items-center mb-8">
                 <div className="flex gap-3 items-center">
                   <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                     <LayoutDashboard className="w-5 h-5 text-blue-400" />
                   </div>
                   <div className="h-5 w-32 bg-white/10 rounded-full" />
                 </div>
                 <div className="flex gap-3">
                   <div className="w-10 h-10 rounded-full bg-white/5" />
                   <div className="w-10 h-10 rounded-full bg-white/5" />
                 </div>
               </div>
               {/* Mock UI Body Bento Grid */}
               <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="col-span-1 sm:col-span-2 row-span-2 bg-white/5 rounded-2xl p-6 flex flex-col">
                   <div className="h-4 w-32 bg-white/10 rounded-full mb-6" />
                   <div className="flex-1 bg-gradient-to-t from-blue-500/20 to-transparent rounded-xl border-b-2 border-blue-500/40" />
                 </div>
                 <div className="col-span-1 bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center hidden sm:flex">
                   <div className="h-4 w-20 bg-white/10 rounded-full mb-4 self-start" />
                   <div className="h-20 w-20 rounded-full border-8 border-yellow-500/50" />
                 </div>
                 <div className="col-span-1 bg-white/5 rounded-2xl p-6 hidden sm:block">
                    <div className="space-y-4 mt-2">
                      <div className="h-3 w-full bg-white/10 rounded-full" />
                      <div className="h-3 w-4/5 bg-white/10 rounded-full" />
                      <div className="h-3 w-full bg-white/10 rounded-full" />
                    </div>
                 </div>
               </div>
               {/* Gradient overlay on hover */}
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             </motion.div>

             {/* Slide 2: Focus Mode */}
             <motion.div 
               whileHover={{ scale: 1.02, y: -5 }}
               transition={{ type: "spring", stiffness: 400, damping: 30 }}
               className="w-[85vw] sm:w-[70vw] max-w-4xl h-[400px] sm:h-[500px] rounded-3xl border border-white/10 bg-[#0a0a0a] p-4 sm:p-8 shrink-0 snap-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group flex items-center justify-center flex-col"
             >
               <div className="absolute top-6 left-6 sm:top-8 sm:left-8 flex gap-3 items-center">
                 <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                   <Target className="w-5 h-5 text-yellow-400" />
                 </div>
                 <div className="h-5 w-32 bg-white/10 rounded-full" />
               </div>
               
               {/* Timer Mock */}
               <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full border-[12px] border-yellow-500/10 flex flex-col items-center justify-center relative">
                 <div className="absolute inset-0 rounded-full border-[12px] border-yellow-500 border-t-transparent -rotate-45" />
                 <span className="text-5xl sm:text-7xl font-black text-white tracking-tighter">25:00</span>
                 <span className="text-sm sm:text-base text-yellow-500 font-bold uppercase tracking-[0.2em] mt-2">Focus Session</span>
               </div>
               
               <div className="mt-12 flex gap-4">
                 <div className="h-12 w-40 bg-yellow-500/20 border border-yellow-500/30 rounded-full" />
                 <div className="h-12 w-12 bg-white/5 rounded-full" />
               </div>
               
               <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             </motion.div>

             {/* Slide 3: Smart Notes */}
             <motion.div 
               whileHover={{ scale: 1.02, y: -5 }}
               transition={{ type: "spring", stiffness: 400, damping: 30 }}
               className="w-[85vw] sm:w-[70vw] max-w-4xl h-[400px] sm:h-[500px] rounded-3xl border border-white/10 bg-[#0a0a0a] p-4 sm:p-6 shrink-0 snap-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group flex gap-6"
             >
               {/* Sidebar Mock */}
               <div className="w-1/4 h-full bg-white/5 rounded-2xl p-6 hidden sm:flex flex-col gap-4">
                 <div className="h-5 w-24 bg-white/10 rounded-full mb-6" />
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className="h-10 w-full bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer" />
                 ))}
               </div>
               {/* Editor Mock */}
               <div className="flex-1 h-full bg-white/[0.02] rounded-2xl p-6 sm:p-10 flex flex-col border border-white/5">
                 <div className="flex gap-4 items-center mb-10">
                   <div className="w-10 h-10 rounded-2xl bg-green-500/20 flex items-center justify-center">
                     <FileText className="w-5 h-5 text-green-400" />
                   </div>
                   <div className="h-8 w-64 bg-white/10 rounded-full" />
                 </div>
                 
                 <div className="space-y-6 flex-1">
                   <div className="h-4 w-full bg-white/5 rounded-full" />
                   <div className="h-4 w-[90%] bg-white/5 rounded-full" />
                   <div className="h-4 w-[95%] bg-white/5 rounded-full" />
                   <div className="h-4 w-[60%] bg-white/5 rounded-full" />
                   
                   <div className="my-8 p-6 rounded-2xl border border-green-500/20 bg-green-500/5 flex gap-4">
                      <BrainCircuit className="w-6 h-6 text-green-400 shrink-0" />
                      <div className="space-y-3 flex-1 pt-1">
                        <div className="h-3 w-[80%] bg-green-500/20 rounded-full" />
                        <div className="h-3 w-[40%] bg-green-500/20 rounded-full" />
                      </div>
                   </div>
                   
                   <div className="h-4 w-full bg-white/5 rounded-full" />
                   <div className="h-4 w-[85%] bg-white/5 rounded-full" />
                 </div>
               </div>
               
               <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             </motion.div>
           </div>
        </div>

        {/* CTA below slider */}
        <div className="mt-8 sm:mt-16 flex justify-center pb-8 px-6">
           <Link 
             href="/login" 
             className="group flex items-center gap-3 text-lg sm:text-2xl font-semibold text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 transition-all duration-300"
           >
             Login to unlock your full potential
             <ArrowRight className="w-6 h-6 text-blue-400 group-hover:translate-x-2 transition-transform" />
           </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-16 pb-8 bg-[#02050D]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="mb-4 flex items-center">
              <Logo className="h-12 w-auto -ml-3" />
            </h3>
            <p className="text-neutral-400 font-medium max-w-sm leading-relaxed mb-4">
              Your all-in-one digital workspace. Organize notes, manage PDFs, track progress, and learn effortlessly with complete focus.
            </p>
            <p className="font-semibold text-sm tracking-wide uppercase bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-transparent bg-clip-text w-fit">
              Developed for students by students.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 tracking-wide uppercase text-sm">Features</h4>
            <ul className="space-y-3 text-neutral-500 font-medium">
              <li><Link href="/dashboard/notes" className="hover:text-yellow-400 transition-colors">Smart Notes</Link></li>
              <li><Link href="/dashboard/library" className="hover:text-red-400 transition-colors">PDF Library</Link></li>
              <li><Link href="/dashboard/youtube" className="hover:text-blue-400 transition-colors">YouTube Study</Link></li>
              <li><Link href="/dashboard/focus" className="hover:text-yellow-400 transition-colors">Focus Mode</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 tracking-wide uppercase text-sm">Connect</h4>
            <ul className="space-y-3 text-neutral-500 font-medium">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Twitter (X)</Link></li>
              <li><Link href="#" className="hover:text-blue-500 transition-colors">Discord</Link></li>
              <li><Link href="#" className="hover:text-neutral-300 transition-colors">GitHub</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 text-center text-neutral-600 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6 gap-4">
          <p className="font-medium text-sm">© {new Date().getFullYear()} Study Hub. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="#" className="hover:text-neutral-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-neutral-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, delay, tooltipText, tooltipKeyword }: { icon: any, title: string, description: string, delay: number, tooltipText?: string, tooltipKeyword?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      viewport={{ once: true, margin: "-10%" }}
      className="bg-neutral-900/50 border border-white/5 rounded-3xl p-8 hover:bg-neutral-800/50 transition-colors group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-bl-full blur-2xl group-hover:bg-yellow-500/20 transition-colors" />
      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
        <Icon strokeWidth={2} className="w-6 h-6" />
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-neutral-400 font-medium leading-relaxed">
        {tooltipKeyword && tooltipText ? (
          <>
            {description.split(tooltipKeyword)[0]}
            <span title={tooltipText} className="underline decoration-dashed decoration-neutral-500 underline-offset-4 cursor-help text-neutral-300">
              {tooltipKeyword}
            </span>
            {description.split(tooltipKeyword)[1]}
          </>
        ) : (
          description
        )}
      </p>
    </motion.div>
  )
}

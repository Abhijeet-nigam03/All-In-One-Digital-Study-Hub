"use client"

import { useState, useEffect, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Search, PlayCircle, Loader2, FileText } from "lucide-react"
import { searchYouTube, getRecommendations, YouTubeSearchResult } from "@/app/actions/youtube"

export default function YouTubePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)
  
  const [recommendations, setRecommendations] = useState<YouTubeSearchResult[]>([])
  const [results, setResults] = useState<YouTubeSearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [currentVideo, setCurrentVideo] = useState<YouTubeSearchResult | null>(null)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const savedNotes = localStorage.getItem("youtube_notes")
    if (savedNotes) {
      setNotes(savedNotes)
    }

    async function loadRecommendations() {
      setIsInitialLoading(true)
      try {
        const recs = await getRecommendations()
        setRecommendations(recs)
        setResults(recs)
      } catch (err) {
        console.error(err)
      } finally {
        setIsInitialLoading(false)
      }
    }
    loadRecommendations()
  }, [])

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value
    setNotes(newNotes)
    localStorage.setItem("youtube_notes", newNotes)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)
    if (!searchQuery.trim()) {
      setResults(recommendations)
      return
    }
    
    setIsLoading(true)
    try {
      const realResults = await searchYouTube(searchQuery)
      if (realResults.length > 0) {
        setResults(realResults)
      } else {
        setResults([])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    if (!val.trim()) {
      setResults(recommendations)
      setHasSearched(false)
    }
  }

  const categories = ["Computer Science", "Math", "Physics", "Study Music", "Productivity"]
  
  const handleCategoryClick = async (category: string) => {
    setSearchQuery(category)
    setHasSearched(true)
    setIsLoading(true)
    try {
      const realResults = await searchYouTube(category)
      setResults(realResults || [])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">YouTube Study Hub</h1>
        <p className="text-muted-foreground">
          Search and watch educational videos without distractions.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
        {/* Main Player Area */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-4 scrollbar-thin">
          <div className="aspect-video shrink-0 bg-black rounded-xl overflow-hidden border flex items-center justify-center relative shadow-lg">
            {currentVideo ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex flex-col items-center text-muted-foreground/50">
                <PlayCircle className="h-20 w-20 mb-4 opacity-50" />
                <p>Select a video to start watching</p>
              </div>
            )}
          </div>
          
          {currentVideo && (
            <div className="p-4 border rounded-xl bg-card/80 backdrop-blur-md shadow-sm shrink-0">
              <h2 className="text-xl font-bold">{currentVideo.title}</h2>
              <div className="flex items-center justify-between mt-2">
                <p className="text-muted-foreground">{currentVideo.channel}</p>
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {currentVideo.category}
                </span>
              </div>
            </div>
          )}

          {/* Quick Notepad */}
          <div className="p-4 border rounded-xl bg-card/80 backdrop-blur-md shadow-sm flex flex-col flex-1 min-h-[250px] shrink-0 mt-2">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Quick Notes
            </h2>
            <Textarea 
              placeholder="Jot down important points from the video here... (Notes are saved automatically to your device)" 
              className="flex-1 resize-y min-h-[150px] bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/50"
              value={notes}
              onChange={handleNotesChange}
            />
          </div>
        </div>

        {/* Sidebar / Search */}
        <div className="w-full lg:w-96 flex flex-col gap-4 border rounded-xl p-4 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              type="search"
              placeholder="Search lectures (e.g. Math, React)..."
              className="pl-9 h-10 bg-background/50 backdrop-blur-md border-muted-foreground/20 focus-visible:ring-primary/50 transition-all"
              value={searchQuery}
              onChange={handleInputChange}
            />
          </form>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button 
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className="text-xs px-2.5 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              {searchQuery && !isLoading ? `Search Results (${results.length})` : isLoading ? "Searching YouTube..." : "Recommended"}
            </h3>
            
            {(isLoading || isInitialLoading) && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            
            {!isLoading && !isInitialLoading && results.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No videos found for "{searchQuery}". Try searching for something else.
              </div>
            )}
            
            {!isLoading && results.map((video) => (
              <div 
                key={video.id} 
                className="group flex gap-3 cursor-pointer rounded-lg hover:bg-muted/80 p-2 -mx-2 transition-all duration-200 hover:shadow-sm"
                onClick={() => setCurrentVideo(video)}
              >
                <div className="w-32 aspect-video bg-muted rounded-md overflow-hidden flex-shrink-0 relative shadow-sm group-hover:shadow-md transition-all">
                  <img src={video.thumbnail} alt={video.title} className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-medium text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">{video.title}</h4>
                  <span className="text-xs text-muted-foreground mt-1.5">{video.channel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

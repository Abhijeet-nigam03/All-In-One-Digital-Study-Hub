"use server"

import ytSearch from "yt-search"

export interface YouTubeSearchResult {
  id: string
  title: string
  channel: string
  thumbnail: string
  category: string
}

export async function searchYouTube(query: string): Promise<YouTubeSearchResult[]> {
  try {
    if (!query || query.trim() === "") return []
    
    const lowerQuery = query.toLowerCase()
    const isEducational = lowerQuery.includes("tutorial") || 
                          lowerQuery.includes("course") || 
                          lowerQuery.includes("lecture") ||
                          lowerQuery.includes("explained") ||
                          lowerQuery.includes("learn")
                          
    const finalQuery = isEducational ? query : `${query} tutorial OR lecture OR course`
    const apiKey = process.env.YOUTUBE_API_KEY

    // Fallback if no API key is provided
    if (!apiKey) {
      console.warn("YOUTUBE_API_KEY is not set. Returning mock results.")
      return [
        { id: "jfKfPfyJRdk", title: "lofi hip hop radio 📚 - beats to relax/study to", channel: "Lofi Girl", thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg", category: "Study Music" },
        { id: "8hly31xKli0", title: "Algorithms and Data Structures Tutorial", channel: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/8hly31xKli0/hqdefault.jpg", category: "Computer Science" },
        { id: "v68zYyaEmEA", title: "Study With Me - 2 Hour Pomodoro", channel: "Study Vibes", thumbnail: "https://i.ytimg.com/vi/v68zYyaEmEA/hqdefault.jpg", category: "Pomodoro" }
      ]
    }

    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(finalQuery)}&type=video&key=${apiKey}`, { next: { revalidate: 3600 } })
    const data = await res.json()
    
    if (!data.items) return []
    
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
      category: "YouTube Search"
    }))
  } catch (error) {
    console.error("YouTube search error:", error)
    return []
  }
}

const EDUCATIONAL_TOPICS = [
  "MIT OpenCourseWare",
  "CrashCourse History",
  "CS50 Harvard full course",
  "React tutorial for beginners",
  "Stanford Physics lecture",
  "Study with me pomodoro",
  "FreeCodeCamp Python course",
  "3Blue1Brown Mathematics"
]

export async function getRecommendations(): Promise<YouTubeSearchResult[]> {
  try {
    const randomTopic = EDUCATIONAL_TOPICS[Math.floor(Math.random() * EDUCATIONAL_TOPICS.length)]
    const apiKey = process.env.YOUTUBE_API_KEY

    // Fallback if no API key is provided
    if (!apiKey) {
      return [
        { id: "jfKfPfyJRdk", title: "lofi hip hop radio 📚 - beats to relax/study to", channel: "Lofi Girl", thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg", category: "Study Music" },
        { id: "8hly31xKli0", title: "Algorithms and Data Structures Tutorial", channel: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/8hly31xKli0/hqdefault.jpg", category: "Computer Science" },
        { id: "v68zYyaEmEA", title: "Study With Me - 2 Hour Pomodoro", channel: "Study Vibes", thumbnail: "https://i.ytimg.com/vi/v68zYyaEmEA/hqdefault.jpg", category: "Pomodoro" }
      ]
    }
    
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(randomTopic)}&type=video&key=${apiKey}`, { next: { revalidate: 3600 } })
    const data = await res.json()
    if (!data.items) return []
    
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
      category: "Recommended"
    }))
  } catch (error) {
    console.error("YouTube recommendations error:", error)
    return []
  }
}

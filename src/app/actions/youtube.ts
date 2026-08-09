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
    
    // Check if the user is already asking for an educational term
    const lowerQuery = query.toLowerCase()
    const isEducational = lowerQuery.includes("tutorial") || 
                          lowerQuery.includes("course") || 
                          lowerQuery.includes("lecture") ||
                          lowerQuery.includes("explained") ||
                          lowerQuery.includes("learn")
                          
    // Append educational keywords if not already present
    const finalQuery = isEducational ? query : `${query} tutorial OR lecture OR course`

    const results = await ytSearch(finalQuery)
    
    if (!results || !results.videos) return []
    
    // Format the first 15 results
    return results.videos.slice(0, 15).map(video => ({
      id: video.videoId,
      title: video.title,
      channel: video.author.name,
      thumbnail: video.thumbnail || "",
      category: "YouTube Search" // yt-search doesn't provide strict categories by default
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
    // Pick a random topic
    const randomTopic = EDUCATIONAL_TOPICS[Math.floor(Math.random() * EDUCATIONAL_TOPICS.length)]
    
    const results = await ytSearch(randomTopic)
    if (!results || !results.videos) return []
    
    // Return 3-5 random videos from the search results
    const shuffled = results.videos.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 6).map(video => ({
      id: video.videoId,
      title: video.title,
      channel: video.author.name,
      thumbnail: video.thumbnail || "",
      category: "Recommended"
    }))
  } catch (error) {
    console.error("YouTube recommendations error:", error)
    return []
  }
}

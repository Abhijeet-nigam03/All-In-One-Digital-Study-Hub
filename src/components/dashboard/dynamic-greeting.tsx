'use client'

import { useState, useEffect } from 'react'

export function DynamicGreeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("Welcome")
  
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting("Good Morning")
    } else if (hour < 18) {
      setGreeting("Good Afternoon")
    } else {
      setGreeting("Good Evening")
    }
  }, [])

  return (
    <h1 className="text-3xl font-bold tracking-tight">
      {greeting}, {name} 👋
    </h1>
  )
}

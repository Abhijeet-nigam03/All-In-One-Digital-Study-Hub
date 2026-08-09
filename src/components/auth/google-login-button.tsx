'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    
    // Determine the callback URL based on the current environment
    const getURL = () => {
      let url =
        process.env.NEXT_PUBLIC_SITE_URL ?? // Hardcoded production URL if set
        (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
      
      // Make sure to include `https://` when not localhost.
      url = url.includes('http') ? url : `https://${url}`
      // Make sure to including trailing `/`.
      url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
      return `${url}auth/callback`
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getURL(),
      },
    })

    if (error) {
      console.error('Error logging in with Google:', error.message)
      alert(error.message)
      setIsLoading(false)
    }
  }

  return (
    <Button 
      type="button" 
      variant="outline" 
      className="w-full relative" 
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <svg
          className="mr-2 h-4 w-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
      )}
      {isLoading ? 'Redirecting...' : 'Sign in with Google'}
    </Button>
  )
}

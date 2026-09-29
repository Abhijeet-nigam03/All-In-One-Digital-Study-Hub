'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function guestLogin(formData: FormData) {
  const rawName = formData.get('username') as string | null
  const username = rawName && rawName.trim() ? rawName.trim() : 'Guest Student'
  
  const cookieStore = await cookies()
  cookieStore.set('guest_name', username, { 
    path: '/', 
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
  
  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=Could not authenticate user')
  }

  const cookieStore = await cookies()
  cookieStore.delete('guest_name')

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        name: formData.get('name') as string,
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/signup?error=Could not sign up user: ' + error.message)
  }

  const cookieStore = await cookies()
  cookieStore.delete('guest_name')

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (err) {
    console.error("Logout error:", err)
  }
  
  const cookieStore = await cookies()
  cookieStore.delete('guest_name')
  
  redirect('/login')
}

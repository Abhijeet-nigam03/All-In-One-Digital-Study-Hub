'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function guestLogin(formData: FormData) {
  const username = formData.get('username') as string
  if (!username) {
    redirect('/login?error=Username is required for guest access')
  }
  
  const cookieStore = await cookies()
  cookieStore.set('guest_name', username, { 
    path: '/', 
    maxAge: 60 * 60 * 24 * 7 // 1 week
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
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  const cookieStore = await cookies()
  cookieStore.delete('guest_name')
  
  redirect('/login')
}

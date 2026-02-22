'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect(`/?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/kernel', 'layout')
    redirect('/kernel')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect(`/?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/kernel', 'layout')
    redirect('/kernel')
}

export async function publishNews(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const title = formData.get('title') as string
    const content = formData.get('content') as string

    const { error } = await supabase
        .from('news')
        .insert({ title, content, author_id: user.id })

    if (error) {
        console.error("Failed to publish news:", error)
    }

    revalidatePath('/news')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}

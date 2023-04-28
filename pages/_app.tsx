import '@/styles/globals.css'
import { MyUserContextProvider } from '@/utils/useUser'
import { Session, createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { AppProps } from 'next/app'
import { useState } from 'react'


export default function App({ Component, pageProps }: AppProps<{
  initialSession: Session
}>) {

  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <MyUserContextProvider>
        <Component {...pageProps} />
      </MyUserContextProvider>
    </SessionContextProvider>
  )
}

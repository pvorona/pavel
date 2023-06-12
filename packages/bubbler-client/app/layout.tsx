'use client'

import { useEffect, useState } from 'react'
import './global.css'
import { UserContext } from '../components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { User } from '@prisma/client'

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function fetchCurrentUser() {
      const response = await fetch('/api/me', { cache: 'no-store' })
      const user = (await response.json()) as User
      setUser(user)
    }

    fetchCurrentUser()
  }, [])

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Irish+Grover&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <UserContext.Provider value={user}>{children}</UserContext.Provider>
        </QueryClientProvider>
      </body>
    </html>
  )
}

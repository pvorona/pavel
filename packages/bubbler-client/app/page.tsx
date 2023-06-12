'use client'

import { useRouter } from 'next/navigation'
import {
  Button,
  ButtonSize,
  Background,
  UserContext,
  Typography,
} from '../components'
import { useContext, useEffect } from 'react'
import { Game } from '@prisma/client'
import { useInterval } from '@pavel/react-utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import classNames from 'classnames'
import styles from './page.module.scss'

export default function Index() {
  const user = useContext(UserContext)
  const name = user?.name ?? 'Choosing username...'
  const router = useRouter()

  useEffect(() => {
    if (user?.currentGameId) {
      router.push(`/game/${user.currentGameId}`)
    }
  }, [router, user?.currentGameId])

  const createGame = useMutation({
    mutationFn: handleCreateGame,
    onSuccess({ id }) {
      router.push(`/game/${id}`)
    },
    onError(error) {
      alert(error)
    },
  })

  async function handleCreateGame() {
    const response = await fetch(`/api/games`, {
      method: 'POST',
    })
    return (await response.json()) as Game
  }

  return (
    <>
      <Background />
      <div className="flex flex-col h-full items-center justify-center text-white">
        <Typography
          className={classNames('mt-36 text-6xl', {
            [styles.Username]: user,
          })}
        >
          {name}
        </Typography>

        <GameList />

        <Button
          disabled={createGame.isLoading || createGame.isSuccess || !user}
          onClick={() => createGame.mutate()}
          size={ButtonSize.Lg}
          className="mt-auto mb-16"
        >
          New game
        </Button>
      </div>
    </>
  )
}

function GameList() {
  const user = useContext(UserContext)
  const games = useQuery({ queryFn: loadGames, queryKey: ['games'] })

  async function loadGames() {
    const response = await fetch('/api/games')
    const games = await response.json()
    return games as (Game & {
      creator: {
        name: string
      }
    })[]
  }

  useEffect(() => {
    if (!user) {
      return
    }

    loadGames()
  }, [user])

  useInterval(() => {
    if (!user) {
      return
    }

    games.refetch()
  }, 1_000)

  const labelClassName = 'text-2xl'

  return (
    <div className="mt-20 relative tracking-wider items-center justify-center flex-col flex w-[500px] min-h-[288px]">
      {games.isLoading && <div className={labelClassName}>Loading...</div>}
      {games.data?.length === 0 && (
        <div className={labelClassName}>No games 😕</div>
      )}
      {games.data && games.data.length !== 0 && (
        <>
          <div className="text-2xl mb-4  opacity-60">Join a game</div>
          {games.data.slice(0, 3).map(game => (
            <Link
              href={`/game/${game.id}`}
              key={game.id}
              className="text-2xl w-full outline-none hover:bg-[#cfb4de30] focus-visible:bg-[#cfb4de30] hover:scale-105 focus-visible:scale-105 duration-75 transition-all p-8 px-10 cursor-pointer rounded-full flex"
            >
              {game.creator.name}
              <span className="ml-auto">
                {formatDate(new Date(game.createdAt))}
              </span>
            </Link>
          ))}
          {games.data.length > 3 && (
            <div className="text-xl absolute -bottom-8 opacity-60">
              And {games.data.length - 3} more...
            </div>
          )}
        </>
      )}
    </div>
  )
}

function formatDate(date: Date) {
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}

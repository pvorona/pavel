import { db } from '@pavel/bubbler-server'
import { GameStatus } from '@prisma/client'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const userId = cookies().get('bubbler')

  if (!userId?.value) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { id } = await db.game.create({
    data: {
      creatorId: userId.value,
    },
  })

  return new Response(JSON.stringify({ id }))
}

export async function GET(request: Request) {
  const games = await db.game.findMany({
    where: { status: GameStatus.WAITING_FOR_OPPONENT },
    include: {
      creator: {
        select: { name: true },
      },
    },
  })

  return new Response(JSON.stringify(games))
}

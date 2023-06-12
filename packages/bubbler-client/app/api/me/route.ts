'use server'

import { db } from '@pavel/bubbler-server'
import { cookies } from 'next/headers'
import { createUsername } from '../../../utils'
import { NextApiResponse } from 'next'

export async function GET(request: Request, response: NextApiResponse) {
  const id = cookies().get('bubbler')

  if (!id?.value) {
    const user = await db.user.create({ data: { name: createUsername() } })
    cookies().set({
      name: 'bubbler',
      value: user.id,
    })

    return new Response(JSON.stringify({ name: user.name }))
  }

  const user = await db.user.findFirstOrThrow({ where: { id: id.value } })

  return new Response(JSON.stringify({ name: user.name }))
}

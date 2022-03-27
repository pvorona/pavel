import { initAuth } from '@pavel/comparator-shared'
import { unsetAuthCookies } from 'next-firebase-auth'

initAuth()

const handler = async (req, res) => {
  try {
    await unsetAuthCookies(req, res)
  } catch (e) {
    return res.status(500).json({ message: 'Unexpected sign out error.', e })
  }
  return res.status(200).send('OK')
}

export default handler

import { initAuth } from '@pavel/comparator-shared'
import { setAuthCookies } from 'next-firebase-auth'

initAuth()

const handler = async (req, res) => {
  try {
    await setAuthCookies(req, res)
  } catch (e) {
    console.log(e)

    return res.status(500).json({ message: 'Unexpected sign in error.', e })
  }
  return res.status(200)
}

export default handler

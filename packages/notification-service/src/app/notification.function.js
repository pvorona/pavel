process.env.NTBA_FIX_319 = 1

const TelegramBot = require('node-telegram-bot-api')

const TOKEN = '5231283478:AAFp3R-RssnoVF0YDc1KooEhYFnQKXweR_I'
const CHAT_ID = '312208882'
const AUTHORIZATION_TOKEN = 'fb205aac-97db-1764-8359-4242cbb10c79'

const bot = new TelegramBot(TOKEN)

exports.notification = async (req, res) => {
  if (req.method !== 'POST') {
    console.error(`Invalid method: ${req.method}`)

    return res.status(405).send('Unsupported method. Use POST instead')
  }

  if (req.headers.authorization !== AUTHORIZATION_TOKEN) {
    console.error(`Unauthorized. Token: ${req.headers.authorization}`)

    return res.status(401).send('Unauthorized')
  }

  const body = JSON.parse(req.body)

  if (!body.message) {
    console.error(`Invalid message: ${body.message}`)

    return res.status(400).send('Invalid message')
  }

  const { message } = body

  try {
    await bot.sendMessage(CHAT_ID, message)
  } catch (error) {
    console.error(
      `Failed to send message: ${message}. Error: ${JSON.stringify(error)}`,
    )
  }

  res.status(200).send('OK')
}

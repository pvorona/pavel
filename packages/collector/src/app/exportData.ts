import { writeFile } from 'fs/promises'
import { MongoClient } from 'mongodb'
import { MONGO_DB_NAME, MONGO_URI } from '../config'
import { COLLECTIONS } from './constants'

const client = new MongoClient(MONGO_URI)

export async function exportData() {
  try {
    await client.connect()
    const db = client.db(MONGO_DB_NAME)
    await db.command({ ping: 1 })
    const collection = db.collection(COLLECTIONS.SP500)

    const cursor = collection.find({})
    const entries = await cursor.toArray()
    await writeFile(`${__dirname}/data.json`, JSON.stringify(entries))

    console.log(`Exported ${entries.length} documents`)
  } catch (error) {
    console.error(error)
  } finally {
    await client.close()
  }
}

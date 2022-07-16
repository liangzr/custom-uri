import { openDB } from 'idb'

const DB_NAME = 'custom-uri'

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore('base')
    db.createObjectStore('model')
  },
})

export async function get(tableName, key) {
  const db = await dbPromise
  const ret = await db.get(tableName, key)
  return ret
}

export async function set(tableName, key, value) {
  const db = await dbPromise
  const ret = await db.put(tableName, value, key)
  return ret
}

import { openDB } from 'idb'

const DB_NAME = 'custom-uri'

const dbInstance = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore('base')
    db.createObjectStore('model')
  },
})

export async function get(tableName, key) {
  const db = await dbInstance

  return db.get(tableName, key)
}

export async function set(tableName, key, value) {
  const db = await dbInstance

  return db.put(tableName, value, key)
}

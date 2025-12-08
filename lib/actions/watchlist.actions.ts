"use server"

import connectToDatabase from '@/database/mongoose'
import Watchlist, { WatchlistItem } from '@/database/models/watchlist.model'

type UserRecord = { _id?: any; id?: string; email?: string }

export const getWatchlistSymbolsByEmail = async (email: string): Promise<string[]> => {
  try {
    const mongoose = await connectToDatabase()
    const db = mongoose.connection.db
    if (!db) return []

    const user: UserRecord | null = await db.collection('user').findOne({ email }, { projection: { _id: 1, id: 1 } })
    if (!user) return []

    const userId = user.id || (user._id && user._id.toString())
    if (!userId) return []

    // Use the mongoose model for nicer typing
    const items: Pick<WatchlistItem, 'symbol'>[] = await Watchlist.find({ userId }).select('symbol').lean()
    return items.map((it) => it.symbol)
  } catch (err) {
    console.error('Error in getWatchlistSymbolsByEmail:', err)
    return []
  }
}

export default getWatchlistSymbolsByEmail

import mongoose, { Schema, Document, Model, model } from 'mongoose'

export interface WatchlistItem extends Document {
    userId: string
    symbol: string
    company: string
    addedAt: Date
}

const watchlistSchema = new Schema<WatchlistItem>({
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: () => new Date() },
})

// Prevent duplicate symbol for same user
watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true })

// Avoid recompiling model on HMR/reload in Next.js dev
const Watchlist: Model<WatchlistItem> = (mongoose.models?.Watchlist as Model<WatchlistItem>) || model<WatchlistItem>('Watchlist', watchlistSchema)

export default Watchlist

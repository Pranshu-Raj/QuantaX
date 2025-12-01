import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    } | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
    if (!MONGODB_URI)
        throw new Error(
            "Please define the MONGODB_URI environment variable inside .env"
        );

    if (cached!.conn) {
        return cached!.conn;
    }

    if (!cached!.promise) {
        // Create the promise the first time and store it on the cache
        const opts = {
            // recommended mongoose options
            // note: these options are safe defaults for mongoose v6+
            // keep bufferCommands false to fail fast when disconnected
            bufferCommands: false,
        } as mongoose.ConnectOptions;

        cached!.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then((mongooseInstance) => {
                return mongooseInstance;
            });
    }

    try {
        cached!.conn = await cached!.promise;
        console.log(
            `Connected to database ${process.env.NODE_ENV || "development"} - ${MONGODB_URI}`
        );
        return cached!.conn;
    } catch (err) {
        cached!.promise = null;
        throw err;
    }
}

export default connectToDatabase;
/* Simple DB connection test script
 * Usage:
 *   MONGODB_URI="mongodb://localhost:27017/testdb" node scripts/test-db-connection.js
 * or export MONGODB_URI and run `node scripts/test-db-connection.js`
 */

const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || '';

async function main() {
  if (!uri) {
    console.error('ERROR: MONGODB_URI environment variable is not set.');
    console.error('Example: MONGODB_URI="mongodb://localhost:27017/testdb" node scripts/test-db-connection.js');
    process.exit(1);
  }

  try {
    console.log('Attempting to connect to:', uri.startsWith('mongodb') ? uri.split('@').pop() : uri);
    // mongoose v6+/node driver manages parser/topology options internally
    await mongoose.connect(uri);

    console.log('✅ Connected to MongoDB successfully');

    // Optional: show database name
    try {
      console.log('Database:', mongoose.connection.db.databaseName);
    } catch (e) {
      // ignore if not permitted
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:');
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();

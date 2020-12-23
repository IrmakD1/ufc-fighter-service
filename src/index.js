require('dotenv').config()

const { server, logger } = require('../server')
const router = require('./api')
const { connectDb } = require('./store')

try {
    const db = connectDb()
    server(router(db))
} catch (err) {
    logger().error(`Failed to connect to DB on startup: "${err.message}"`);
    process.exit(1);
}

require('dotenv').config()

const server = require('./server')
const router = require('./api')

server(router())
const Router = require('express').Router

const fightersRouter = require('./fighters')
const eventsRouter = require('./events')

const router = (db) => {
    const router = Router()
    
    router.use('/fighters', fightersRouter(db))
    router.use('/events', eventsRouter(db))

    return router
}

module.exports = router
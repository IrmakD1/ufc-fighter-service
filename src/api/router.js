const Router = require('express').Router

const fighterRouter = require('./fighters')
const eventsRouter = require('./events')

const router = () => {
    const router = Router()
    
    router.use('/fighters', fighterRouter())
    router.use('/events', eventsRouter())

    return router
}

module.exports = router
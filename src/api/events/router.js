const Router = require('express').Router

const { logger } = require('../../../server')
const service = require('./service')


const eventsRouter = (db) => {
    router = Router()

    router.get('/calendar', async (req, res, next) => {

        try {
            const data = await service.getEvents(db, 'Events')

            logger().info('Calendar request successfully accessed', Date())
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    })

    router.get('/details/:seasonId', async (req, res, next) => {

        try {
            const data = await service.getSingleEventDetails(db, req.params.seasonId, 'Event Details')

            logger().info('event details request successfully accessed ', Date())
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    })

    return router
}

module.exports = eventsRouter
const Router = require('express').Router

const service = require('./service')


const eventsRouter = () => {
    router = Router()

    router.get('/calendar', async (req, res, next) => {

        try {
            const data = await service.getEvents()

            console.log('Calendar request successfully accessed', Date())
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    })

    router.get('/details/:seasonId', async (req, res, next) => {

        try {
            const data = await service.getEventDetails(req.params.seasonId)

            console.log('event details request successfully accessed ', Date())
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    })

    return router
}

module.exports = eventsRouter
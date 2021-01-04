const Router = require('express').Router

const { logger } = require('../../../server')
const service = require('./service')


const fightersRouter = (db) => {
    router = Router()

    router.get('/', async (req, res, next) => {

        try {
            const data = await service.getFighters(req.query.fighterOneId, req.query.fighterTwoId, db)

            logger().info('Successfully Returned Fighter Details');

            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    })

    router.get('/weightclass/:weightclass', async (req, res, next) => {
        try {
            const data = await service.getWeightClassFighters(req.params.weightclass, db)

            logger().info('Successfully Returned Weightclass Fighter Details');

            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    })

    return router
}

module.exports = fightersRouter
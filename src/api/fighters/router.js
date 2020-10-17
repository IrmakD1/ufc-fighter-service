const Router = require('express').Router

const service = require('./service')


const fighterRouters = () => {
    router = Router()

    router.get('/', async (req, res, next) => {

        try {
            const data = await service.getFighters(req.query.fighterOneId, req.query.fighterTwoId)

            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    })

    return router
}

module.exports = fighterRouters
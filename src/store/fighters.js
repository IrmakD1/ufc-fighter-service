const Boom = require('@hapi/boom');
const { logger } = require('../../server')

const getFighterDetails = async (fighterId, db, collection) => {
    const fighterRef = db.collection(collection).doc(fighterId)
    try {
        const doc = await fighterRef.get()
        if (!doc.exists) {
            throw Boom.notFound('Could not find any valid records')
        } else {
            logger().info('Successfully retrieved Fighter from db')
            const res = doc.data()

            return res
        }
    } catch (err) {
        throw Boom.badData(`Could not retrieve existing record: ${err}`)
    }
}

module.exports = { getFighterDetails }
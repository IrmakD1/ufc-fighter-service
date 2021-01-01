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

const getAllRankedFighters = async (db) => {
    let rankedFighters = []
    
    const rankingsRef = db.collection('Rankings')

    try {
        snapshot = await rankingsRef.get()

        if (snapshot.empty) {
            throw new Error('Could not find any valid records')
        }  

        logger().info('Successfully retrieved Ranked Fighters from db')

        snapshot.forEach(doc => {

            const res = doc.data()

            rankedFighters.push(res)
        })

        return rankedFighters
    } catch (err) {
        throw Boom.badData(`Could not retrieve existing record: ${err}`)
    }
}

module.exports = { getFighterDetails, getAllRankedFighters }
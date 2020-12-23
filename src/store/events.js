const Boom = require('@hapi/boom');
const { logger } = require('../../server')

const getAllEvents = async (db, collection) => {
    let eventResults = []
    
    const eventsRef = db.collection(collection)

    logger().info(`Getting events from ${collection}`)
    
    try {
        const snapshot = await eventsRef.get()

        if (snapshot.empty) {
            throw Boom.notFound('Could not find any valid records')
        }  

        logger().info('Successfully retrieved Events from db')

        snapshot.forEach(doc => {

            const res = doc.data()

            eventResults.push(res)
        })

        return eventResults
    } catch (err) {
        throw Boom.badData(`Could not retrieve existing records: ${err}`)
    }
}

const getSingleEvent = async (db, eventId, collection) => {
    const eventRef = db.collection(collection).doc(eventId)
    try {
        const doc = await eventRef.get()
        if (!doc.exists) {
            throw Boom.notFound('Could not find any valid records')
        } else {
            logger().info('Successfully retrieved Event from db')
            const res = doc.data()

            return res
        }
    } catch (err) {
        throw Boom.badData(`Could not retrieve existing record: ${err}`)
    }
}

module.exports = {
    getAllEvents,
    getSingleEvent
}